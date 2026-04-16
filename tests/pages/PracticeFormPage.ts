import { Page } from "@playwright/test";

export class PracticeFormPage {
  async hideOverlays() {
    // Hide ad overlays and modals that may block pointer events
    await this.page.evaluate((() => {
      const fixedban = document.getElementById("fixedban");
      if (fixedban) fixedban.style.display = "none";
      const adPlus = document.getElementById("adplus-anchor");
      if (adPlus) adPlus.style.display = "none";
      const modals = document.querySelectorAll(
        '.modal, .modal-backdrop, [role="dialog"]',
      );
      modals.forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
      document.querySelectorAll("iframe").forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    }) as () => void);
  }
  public readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("https://demoqa.com/automation-practice-form");
  }

  async fillFirstName(value: string) {
    await this.page.fill("#firstName", value);
  }

  async fillLastName(value: string) {
    await this.page.fill("#lastName", value);
  }

  async fillEmail(value: string) {
    await this.page.fill("#userEmail", value);
  }

  async selectGender(gender: "Male" | "Female" | "Other" = "Other") {
    const genderMap: Record<string, string> = {
      Male: "gender-radio-1",
      Female: "gender-radio-2",
      Other: "gender-radio-3",
    };
    await this.page.locator(`label[for="${genderMap[gender]}"]`).click();
  }

  async fillMobile(value: string) {
    await this.page.fill("#userNumber", value);
  }

  async setDateOfBirth(date: string) {
    await this.page.click("#dateOfBirthInput");
    await this.page.fill("#dateOfBirthInput", date); // Format: dd mmm yyyy
    await this.page.press("#dateOfBirthInput", "Enter");
  }

  async fillSubjects(subjects: string[]) {
    for (const subject of subjects) {
      await this.page.fill("#subjectsInput", subject);
      await this.page.keyboard.press("Enter");
    }
    await this.page.keyboard.press("Escape");
  }

  async selectHobbies() {
    await this.hideOverlays();
    for (const id of [
      "hobbies-checkbox-1",
      "hobbies-checkbox-2",
      "hobbies-checkbox-3",
    ]) {
      await this.page.locator(`label[for="${id}"]`).click({ force: true });
    }
  }

  async uploadPicture(filePath: string) {
    await this.page.setInputFiles("#uploadPicture", filePath);
  }

  async fillCurrentAddress(value: string) {
    await this.page.fill("#currentAddress", value);
  }

  async selectStateAndCity(state: string, city: string) {
    await this.page.click("#state");
    await this.page
      .locator(`div[id^="react-select-3-option"]:has-text("${state}")`)
      .click();
    await this.page.click("#city");
    await this.page
      .locator(`div[id^="react-select-4-option"]:has-text("${city}")`)
      .click();
  }

  async submit() {
    await this.page.click("#submit");
  }

  async getConfirmationModal() {
    return this.page.locator(".modal-content");
  }

  async getEmailError() {
    return this.page.locator("#userEmail:invalid");
  }
}
