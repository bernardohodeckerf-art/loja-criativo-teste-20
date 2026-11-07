import { test, expect, type Page } from "@playwright/test";

async function showMaterial(page: Page, index: number) {
  await page.evaluate((index) => {
    const root = document.querySelector("#materiais-em-cena")!,
      track = root.querySelector<HTMLElement>(".material-experience-scroll")!,
      stage = root.querySelector<HTMLElement>(".material-experience-stage")!;
    if (getComputedStyle(stage).position === "sticky") {
      window.scrollTo({
        top:
          track.getBoundingClientRect().top +
          scrollY -
          parseFloat(getComputedStyle(stage).top) +
          (index / 2) * (track.offsetHeight - stage.offsetHeight),
        behavior: "instant",
      });
    } else {
      root.querySelectorAll(".material-photo")[index].scrollIntoView({
        block: "center",
        behavior: "instant",
      });
    }
  }, index);
}

test("galeria muda de cena ao rolar no desktop e no celular, mantendo acesso às medidas", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#materiais-em-cena");
    const root = page.locator("#materiais-em-cena");
    await expect(root.locator(".material-photo img")).toHaveCount(3);
    for (const [index, label] of [
      "Aço · Barras",
      "Telas e malhas",
      "Rolos de aço",
    ].entries()) {
      await showMaterial(page, index);
      await expect(root).toHaveAttribute("data-scene-index", String(index));
      await expect(root.locator(".material-current-caption")).toContainText(label);
      const card = root.locator(".material-photo").nth(index);
      await expect(card).toHaveAttribute("data-active", "true");
      await expect(card.getByRole("heading")).toBeVisible();
      await expect(card.locator("img")).toHaveAttribute("srcset", /3840w/);
      await expect
        .poll(() => card.locator("img").evaluate((img) => (img as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (width === 1440) {
      await root.getByRole("button", { name: /02.*Telas/ }).click();
      await expect(root).toHaveAttribute("data-scene-index", "1");
      await root.getByRole("button", { name: /03.*Rolos/ }).click();
      await expect(root).toHaveAttribute("data-scene-index", "2");
    }
    await root.locator(".material-photo").last().click();
    await expect(page.getByLabel("Filtrar categoria")).toHaveValue("rolo");
    await expect(page.locator(".product-card")).toHaveCount(5);
  }
});

test("galeria oferece leitura estática e respeita movimento reduzido", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#materiais-em-cena");
  const root = page.locator("#materiais-em-cena");
  await root.getByRole("button", { name: "Ver sem animação", exact: true }).click();
  await expect(root).toHaveClass(/is-static/);
  await expect(root.locator(".material-experience-stage")).toHaveCSS("position", "relative");
  await expect(root.locator(".material-photo").first()).toHaveCSS("transform", "none");
  await root.getByRole("button", { name: "Ativar animação", exact: true }).click();
  await expect(root).not.toHaveClass(/is-static/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root).toHaveClass(/is-static/);
  await expect(root.getByRole("navigation", { name: "Etapas dos materiais" })).toHaveCount(0);
  for (const card of await root.locator(".material-photo").all()) {
    await expect(card).toHaveCSS("transform", "none");
    await expect(card.getByRole("heading")).toBeVisible();
  }
  await page.setViewportSize({ width: 320, height: 740 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
