import { test, expect } from "@playwright/test";

test("vídeos HLS: posters sem download automático, áudio e pausa mútua", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/videos/hls-")) requests.push(request.url());
  });
  await page.goto("/");
  const section = page.locator("#videos");
  await section.scrollIntoViewIfNeeded();
  const videos = section.locator("video");
  await expect(videos).toHaveCount(2);
  for (const player of await videos.all()) {
    await expect(player).not.toHaveAttribute("src");
    await expect(player).toHaveAttribute("preload", "none");
    await expect(player).toHaveJSProperty("paused", true);
    await expect(player).toHaveJSProperty("muted", false);
    await expect(player).toHaveAttribute("poster", /poster\.webp$/);
  }
  expect(requests).toEqual([]);
  await section
    .getByRole("button", {
      name: "Reproduzir Barras de transferência na construção",
    })
    .click();
  const first = videos.nth(0);
  await expect(first).toHaveJSProperty("paused", false);
  await expect(first).toHaveJSProperty("controls", true);
  await expect
    .poll(() => first.evaluate((v) => (v as HTMLVideoElement).videoWidth))
    .toBe(720);
  await expect
    .poll(() => first.evaluate((v) => (v as HTMLVideoElement).videoHeight))
    .toBe(1280);
  await expect
    .poll(() => first.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(0);
  await section
    .getByRole("button", { name: "Reproduzir Um olhar por dentro da HLS" })
    .click();
  await expect(videos.nth(1)).toHaveJSProperty("paused", false);
  await expect(first).toHaveJSProperty("paused", true);
  await expect(videos.nth(1)).toHaveJSProperty("muted", false);
  await expect
    .poll(() =>
      videos.nth(1).evaluate((v) => (v as HTMLVideoElement).currentTime),
    )
    .toBeGreaterThan(0);
  await first.evaluate((v) => (v as HTMLVideoElement).play());
  await expect(videos.nth(1)).toHaveJSProperty("paused", true);
});

test("vídeo com falha: mensagem acessível e nova tentativa", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/videos/hls-barras-transferencia.mp4", (route) =>
    fail ? route.fulfill({ status: 503, body: "" }) : route.continue(),
  );
  await page.goto("/");
  const section = page.locator("#videos");
  await section
    .getByRole("button", {
      name: "Reproduzir Barras de transferência na construção",
    })
    .click();
  await expect(section.getByRole("status")).toHaveText(
    "Não foi possível carregar este vídeo.",
  );
  fail = false;
  await section.getByRole("button", { name: "Tentar novamente" }).click();
  await expect(section.locator("video").first()).toHaveJSProperty(
    "paused",
    false,
  );
  await expect(section.getByRole("status")).toHaveCount(0);
});

test("vídeos móveis: retrato completo e acionamento por teclado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator("#videos");
  await section.scrollIntoViewIfNeeded();
  const first = section.locator("video").first();
  const box = await first.boundingBox();
  expect(box!.width / box!.height).toBeCloseTo(9 / 16, 2);
  await expect(first).toHaveCSS("object-fit", "contain");
  const play = section.getByRole("button", {
    name: "Reproduzir Barras de transferência na construção",
  });
  await play.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveJSProperty("paused", false);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});
