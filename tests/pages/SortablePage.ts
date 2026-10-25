import { Locator, Page } from "@playwright/test";

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

  // Manual mouse drag with intermediate steps: locator.dragTo() fires a single
  // move, which jQuery-UI sortable on demoqa often ignores on slow CI runners.
  private async dragItem(source: Locator, target: Locator) {
    await source.scrollIntoViewIfNeeded();
    const from = await source.boundingBox();
    const to = await target.boundingBox();
    if (!from || !to) return;
    await this.page.mouse.move(
      from.x + from.width / 2,
      from.y + from.height / 2,
    );
    await this.page.mouse.down();
    await this.page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
      steps: 15,
    });
    await this.page.mouse.up();
  }

  async shuffleGridItems() {
    // UI shuffle: drag items randomly. Retry (up to 3 rounds) until the order
    // really differs from the starting one, since a drag can be dropped by the
    // sortable widget and leave the grid unchanged.
    const initial = (await this.getGridOrder()).join(",");
    for (let attempt = 0; attempt < 3; attempt++) {
      const items = await this.getGridItems();
      const count = await items.count();
      for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        if (i !== j) {
          await this.dragItem(items.nth(i), items.nth(j));
        }
      }
      if ((await this.getGridOrder()).join(",") !== initial) return;
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
