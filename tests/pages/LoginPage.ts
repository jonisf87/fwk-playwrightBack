import { Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput = "#userName";
  readonly passwordInput = "#password";
  readonly loginButton = "#login";
  readonly errorMessage = "#name";
  readonly logoutButton = "#submit";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("https://demoqa.com/login");
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async isLoggedIn(): Promise<boolean> {
    // Profile page shows logout button if logged in
    return this.page.isVisible(this.logoutButton);
  }

  async getErrorMessage(): Promise<string | null> {
    // Try multiple selectors and wait for error message to appear
    const selectors = [
      "#name", // original
      ".mb-1", // class used for error message
      ".text-danger",
      ".alert-danger",
      ".error-message",
    ];
    for (const selector of selectors) {
      try {
        await this.page.waitForSelector(selector, {
          state: "visible",
          timeout: 3000,
        });
        const text = await this.page.textContent(selector);
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } catch {
        // Ignore timeout and try next selector
      }
    }
    return null;
  }
}
