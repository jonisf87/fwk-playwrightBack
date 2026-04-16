import { Page } from "@playwright/test";

export class RegistrationPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("https://demoqa.com/register");
  }

  private async waitAndFill(selector: string, value: string) {
    await this.page
      .locator(selector)
      .waitFor({ state: "visible", timeout: 10000 });
    await this.page.fill(selector, value);
  }

  async fillFirstName(firstName: string) {
    await this.waitAndFill(
      'input#firstname[placeholder="First Name"]',
      firstName,
    );
  }

  async fillLastName(lastName: string) {
    await this.waitAndFill('input#lastname[placeholder="Last Name"]', lastName);
  }

  async fillUserName(userName: string) {
    await this.waitAndFill('input#userName[placeholder="UserName"]', userName);
  }

  async fillPassword(password: string) {
    await this.waitAndFill('input#password[placeholder="Password"]', password);
  }

  async clickCaptchaCheckbox() {
    // Try to click the reCAPTCHA checkbox if present (in iframe)
    // Wait for iframe to appear
    const frames = this.page.frames();
    const captchaFrame = frames.find((f) =>
      f.url().includes("google.com/recaptcha"),
    );
    if (captchaFrame) {
      try {
        await captchaFrame.click("#recaptcha-anchor", { timeout: 5000 });
      } catch {
        // Ignore if not clickable
      }
    }
  }

  async clickRegister() {
    await this.page.click("#register");
  }

  async getSuccessMessage() {
    return this.page.locator(".text-success").textContent();
  }

  async getErrorMessage() {
    return this.page.locator("#name").textContent();
  }

  // Note: CAPTCHA is present but ignored for automation
}
