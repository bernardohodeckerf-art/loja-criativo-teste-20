import { test, expect } from "@playwright/test";

test("blocos aguardam a rolagem e entram um a um com movimentos diferentes", async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.keyboard.press("Escape");
    const title = page.locator("#produtos h2"),
      photo = page.locator(".about-image"),
      team = page.locator(".team").first(),
      contact = page.locator(".contact-heading h2");
    await expect(photo).toHaveAttribute("data-reveal-state", "pending");
    await expect(photo).toHaveCSS("opacity", "0");
    await expect(team).toHaveCSS("opacity", "0");
    await expect(contact).toHaveCSS("opacity", "0");
    const kinds = await Promise.all([title, photo, team, contact].map((node) => node.getAttribute("data-reveal")));
    expect(new Set(kinds).size).toBe(4);
    await title.scrollIntoViewIfNeeded();
    await expect(title).toHaveAttribute("data-reveal-state", "seen");
    await expect(photo).toHaveAttribute("data-reveal-state", "pending");
    await expect(contact).toHaveCSS("opacity", "0");
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute("data-reveal-state", "seen");
    await expect(photo).toHaveCSS("opacity", "1");
    await expect(team).toHaveCSS("opacity", "0");
    await team.scrollIntoViewIfNeeded();
    await expect(team).toHaveAttribute("data-reveal-state", "seen");
    await expect(contact).toHaveCSS("opacity", "0");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact).toHaveAttribute("data-reveal-state", "seen");
    await expect(contact).toHaveCSS("opacity", "1");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});

test("foco e preferência reduzida tornam o conteúdo disponível imediatamente", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  const button = page.locator(".quote-invitation-panel button");
  await button.focus();
  await expect(page.locator(".quote-invitation-panel")).toHaveAttribute("data-reveal-state", "seen");
  await expect(button).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("main [data-reveal-state='pending']")).toHaveCount(0);
  await expect(page.locator(".team").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".contact-heading h2")).toHaveCSS("opacity", "1");
  await page.reload();
  await expect(page.locator("main [data-reveal]")).toHaveCount(0);
  await expect(page.locator(".about-image")).toHaveCSS("opacity", "1");
});

test("gesto de toque revela o próximo título no celular e preserva a rolagem", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: "Pular abertura" }).tap();
  const title = page.locator("#produtos h2");
  await expect(title).toHaveAttribute("data-reveal-state", "pending");
  await expect(title).toHaveCSS("opacity", "0");
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 35, y: 700 }] });
  for (let i = 1; i <= 10; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 35, y: 700 - i * 42 }] });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  await expect(title).toHaveAttribute("data-reveal-state", "seen");
  await expect(title).toHaveCSS("opacity", "1");
  await expect(page.locator(".contact-heading h2")).toHaveCSS("opacity", "0");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await context.close();
});

test("clicar durante a entrada mantém o alvo estável e abre o questionário", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  const panel = page.locator(".quote-invitation-panel");
  await panel.scrollIntoViewIfNeeded();
  await expect(panel).toHaveAttribute("data-reveal-state", "entering");
  const button = panel.getByRole("button", { name: "Quero cotar minha obra" });
  const initial = (await button.boundingBox())!;
  await page.mouse.move(initial.x + initial.width / 2, initial.y + initial.height / 2);
  await page.mouse.down();
  // Web Animations applies pause on its rendering tick; measure the painted
  // position after that tick rather than comparing against the previous frame.
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
  const held = (await button.boundingBox())!;
  await page.waitForTimeout(180);
  const still = (await button.boundingBox())!;
  expect(Math.abs(still.y - held.y)).toBeLessThan(1);
  await page.mouse.up();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("O que sua obra precisa?");
});
