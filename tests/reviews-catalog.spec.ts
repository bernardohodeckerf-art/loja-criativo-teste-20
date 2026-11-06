import { test, expect } from "@playwright/test";

test("catálogo compacto: uma foto por categoria e todas as medidas selecionáveis", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const filter = page.getByLabel("Filtrar categoria");
  for (const [category, count] of [
    ["aco-barras", 9],
    ["pregos", 24],
    ["arame-recozido", 5],
    ["trelica", 7],
    ["tela-soldada", 8],
    ["coluna-pronta", 4],
    ["rolo", 5],
    ["estribo", 3],
    ["malha-tela-mf", 5],
    ["btg", 3],
  ] as const) {
    await filter.selectOption(category);
    await expect(page.locator(".product-card")).toHaveCount(count);
    await expect(page.locator(".catalog-group")).toHaveCount(1);
    expect(
      await page.locator(".category-photo img").count(),
    ).toBeLessThanOrEqual(1);
    await expect(page.locator(".product-card img")).toHaveCount(0);
    expect(
      (await page.locator(".product-card").first().boundingBox())!.height,
    ).toBeLessThanOrEqual(90);
  }
  await filter.selectOption("");
  await expect(page.locator(".product-card")).toHaveCount(73);
  await expect(page.locator(".catalog-group")).toHaveCount(10);
  await expect(page.locator(".category-photo img")).toHaveCount(5);
  await page
    .getByRole("button", { name: "Consultar Estribo 7x17", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Continuar", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Estribo 7x17");
});

test("avaliações: fonte datada, notas reais e animação com pausa e leitura estática", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const section = page.locator("#avaliacoes");
  await section.scrollIntoViewIfNeeded();
  await expect(section).toContainText("4,7");
  await expect(section).toContainText("63 avaliações");
  await expect(section).toContainText("06/11/2026");
  await page.mouse.move(0, 0);
  const track = section.locator(".review-marquee-track").first();
  await expect(track).toHaveCSS("animation-play-state", "running");
  const reviewBox = await section
    .locator(".google-review-card")
    .nth(1)
    .boundingBox();
  await page.mouse.move(
    reviewBox!.x + reviewBox!.width / 2,
    reviewBox!.y + reviewBox!.height / 2,
  );
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.mouse.move(0, 0);
  await expect(track).toHaveCSS("animation-play-state", "running");
  await expect(section.locator(".review-perspective")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await expect(
    section.locator(".review-perspective").locator("a,button,input,[tabindex]"),
  ).toHaveCount(0);
  await section.getByRole("button", { name: "Pausar movimento" }).click();
  await expect(
    section.getByRole("button", { name: "Retomar movimento" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(section.locator(".review-marquee-track").first()).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await section
    .getByText("Ler avaliações sem movimento", { exact: true })
    .click();
  const list = section.getByRole("list");
  await expect(list.getByRole("listitem")).toHaveCount(9);
  await expect(
    list.getByText("Sidnei Oliveira Da Rosa", { exact: true }),
  ).toBeVisible();
  await expect(list.getByRole("img", { name: "3 de 5 estrelas" })).toHaveCount(
    1,
  );
  await expect(list.getByRole("img", { name: "4 de 5 estrelas" })).toHaveCount(
    1,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(section.locator(".review-perspective")).toHaveCount(0);
  await expect(section.getByRole("listitem")).toHaveCount(9);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(section.locator(".review-perspective")).toHaveCount(1);
  await expect(section.locator('[data-slot="marquee"]')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
