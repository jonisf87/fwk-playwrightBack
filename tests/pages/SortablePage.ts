import { Page } from "@playwright/test";

export class SortablePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("https://demoqa.com/sortable", {
      waitUntil: "load",
      timeout: 60000,
    });
    await this.page.evaluate(() => {
      const fixedban = document.getElementById("fixedban");
      if (fixedban) fixedban.style.display = "none";
      const adPlus = document.getElementById("adplus-anchor");
      if (adPlus) adPlus.style.display = "none";
      document.querySelectorAll("iframe").forEach((el) => {
        (el as HTMLElement).style.display = "none";
      });
    });
  }

  async goToGridTab() {
    const tab = this.page
      .locator("a#demo-tab-grid")
      .or(this.page.getByRole("tab", { name: "Grid" }));
    await tab.first().waitFor({ state: "attached", timeout: 30000 });
    await tab.first().evaluate((el) => (el as HTMLElement).click());
  }

  async getGridItems() {
    return this.page.locator(".create-grid .list-group-item");
  }

  async shuffleGridItems() {
    // This is a UI shuffle simulation: drag and drop items randomly
    const items = await this.getGridItems();
    const count = await items.count();
    for (let i = count - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      if (i !== j) {
        await items.nth(i).dragTo(items.nth(j));
      }
    }
  }

  async getGridOrder() {
    const items = await this.getGridItems();
    const count = await items.count();
    const order: string[] = [];
    for (let i = 0; i < count; i++) {
      order.push(await items.nth(i).innerText());
    }
    return order;
  }
}
