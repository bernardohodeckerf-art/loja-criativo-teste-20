import { test, expect } from "@playwright/test";

test("abertura HLS: logo real, cortina automática e sem repetição na mesma aba", async ({
  page,
}) => {
  await page.goto("/");
  const intro = page.locator(".brand-intro");
  await expect(intro).toBeVisible();
  await expect(intro).toHaveAttribute("aria-hidden", "true");
  await expect(intro.locator("img")).toHaveAttribute(
    "src",
    "/images/hls-logo.png",
  );
  await expect(
    page.getByRole("button", { name: "Pular abertura" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).not.toBe("hidden");
  await expect(intro).toHaveCount(0, { timeout: 3000 });
  await expect(page.locator("html")).not.toHaveClass(/hls-intro-active/, {
    timeout: 3000,
  });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.reload();
  await expect(intro).toHaveCount(0);
  expect(
    await page.evaluate(() => sessionStorage.getItem("hls:intro:seen")),
  ).toBe("1");
});

test("abertura móvel não alarga a página e pode ser pulada imediatamente", async ({
  browser,
}) => {
  for (const [width, height] of [
    [320, 740],
    [844, 390],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:5173/");
    await expect(page.locator(".brand-intro")).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    const skip = page.getByRole("button", {
      name: "Pular abertura",
      exact: true,
    });
    expect((await skip.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await skip.tap();
    await expect(page.locator(".brand-intro")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Pedir orçamento", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await context.close();
  }
});

test("abertura respeita movimento reduzido, link direto e teclado", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".brand-intro")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#catalogo");
  await expect(page.locator(".brand-intro")).toHaveCount(0);
  await page.goto("/?intro=keyboard");
  await expect(page.locator(".brand-intro")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".brand-intro")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/hls-intro-active/);
});
