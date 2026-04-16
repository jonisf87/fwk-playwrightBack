import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CustomWorld } from "../support/world";
import fs from "fs";
import path from "path";

const dataPath = path.resolve(process.cwd(), "tests/support/data.json");

Given("I navigate to the login page", async function (this: CustomWorld) {
  if (!this.page) {
    throw new Error("No page available in world context");
  }
  this.pageObj = new LoginPage(this.page);
  await this.pageObj.goto();
});

When(
  "I fill in the login form with valid stored credentials",
  async function (this: CustomWorld) {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    // Support both userName and username keys for compatibility
    const username = data.userName || data.username;
    const password = data.password;
    if (!username || !password) {
      throw new Error(
        "Stored credentials are missing userName/username or password",
      );
    }
    if (this.pageObj instanceof LoginPage) {
      await this.pageObj.login(username, password);
    } else {
      throw new Error("pageObj is not a LoginPage");
    }
  },
);

When(
  "I fill in the login form with invalid credentials",
  async function (this: CustomWorld) {
    if (this.pageObj instanceof LoginPage) {
      await this.pageObj.login("invalidUser", "invalidPass");
    } else {
      throw new Error("pageObj is not a LoginPage");
    }
  },
);

Then("I should see my profile page", async function (this: CustomWorld) {
  // Wait for profile page username element, capture debug info if not found
  if (!this.page) {
    throw new Error("No page available in world context");
  }
  try {
    await this.page.waitForSelector("#userName-value", { timeout: 5000 });
  } catch {
    // Capture screenshot and page content for debugging
    await this.page.screenshot({
      path: "reports/login-profile-fail.png",
      fullPage: true,
    });
    // const html = await this.page.content(); // Removed to fix lint error
    // For CI logs: Login failed, page HTML snippet: (see below)
    // (HTML snippet omitted to avoid console statement)
    // To debug, check the screenshot and HTML content in the reports directory.
    throw new Error(
      "Profile page not visible after login. Screenshot saved to reports/login-profile-fail.png",
    );
  }
  if (this.pageObj instanceof LoginPage) {
    expect(await this.pageObj.isLoggedIn()).toBeTruthy();
  } else {
    throw new Error("pageObj is not a LoginPage");
  }
});

Then("I should see a login error message", async function (this: CustomWorld) {
  if (this.pageObj instanceof LoginPage) {
    const error = await this.pageObj.getErrorMessage();
    expect(error).not.toBeNull();
    // Accept any error message containing 'invalid' or 'not match' (case-insensitive)
    expect(error?.toLowerCase()).toMatch(/invalid|not match/);
  } else {
    throw new Error("pageObj is not a LoginPage");
  }
});
