import { test, expect } from "@playwright/test";

test("site móvel completo: conteúdo sem cortes laterais e navegação acessível", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  for (const [width, height] of [
    [320, 740],
    [390, 844],
    [768, 1024],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("http://127.0.0.1:5173/");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    const clipped = await page
      .locator("main > section")
      .evaluateAll((sections) =>
        sections
          .filter((section) => {
            const box = section.getBoundingClientRect();
            return box.left < -1 || box.right > innerWidth + 1;
          })
          .map((section) => section.id || section.className),
      );
    expect(clipped).toEqual([]);
    const menu = page.getByRole("button", { name: "Abrir menu", exact: true });
    if (await menu.isVisible()) {
      await menu.tap();
      const contact = page
        .getByRole("navigation", { name: "Navegação principal" })
        .getByRole("link", { name: "Contato", exact: true });
      await contact.scrollIntoViewIfNeeded();
      await contact.tap();
      await expect(menu).toHaveAttribute("aria-expanded", "false");
    }
    const quote = page.getByRole("button", {
      name: "Orçamento rápido",
      exact: true,
    });
    expect((await quote.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await quote.tap();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    expect(
      await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth),
    ).toBeTruthy();
    await page
      .getByRole("checkbox", { name: "Preciso de orientação para escolher" })
      .check();
    await dialog.getByRole("button", { name: "Continuar", exact: true }).tap();
    const city = page.getByRole("textbox", { name: "Cidade" });
    expect(
      await city.evaluate((node) =>
        parseFloat(getComputedStyle(node).fontSize),
      ),
    ).toBeGreaterThanOrEqual(16);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  }
  await context.close();
});

test("paisagem curta: controles da cena continuam utilizáveis e players preservam o retrato", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  const scene = page.locator("#em-movimento");
  await scene.scrollIntoViewIfNeeded();
  const pause = scene.getByRole("button", {
    name: "Pausar animação",
    exact: true,
  });
  await pause.scrollIntoViewIfNeeded();
  await pause.click();
  await expect(
    scene.getByRole("button", { name: "Retomar animação", exact: true }),
  ).toBeVisible();
  const stage = scene.locator(".story-stage");
  const usable = await stage.evaluate((node) => {
    const css = getComputedStyle(node);
    return (
      css.overflow !== "hidden" || node.scrollHeight <= node.clientHeight + 1
    );
  });
  expect(usable).toBeTruthy();
  for (const player of await page.locator("#videos .vertical-player").all()) {
    const box = await player.boundingBox();
    expect(box!.width / box!.height).toBeCloseTo(9 / 16, 2);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    844,
  );
});
