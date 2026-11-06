import { test, expect, type Page } from "@playwright/test";
async function setStoryProgress(page: Page, progress: number) {
  await page.evaluate((p) => {
    const root = document.querySelector<HTMLElement>("#em-movimento")!,
      stage = root.querySelector<HTMLElement>(".story-stage")!;
    const y =
      root.getBoundingClientRect().top +
      scrollY -
      parseFloat(getComputedStyle(stage).top) +
      p * (root.offsetHeight - stage.offsetHeight);
    window.scrollTo({ top: y, behavior: "instant" });
  }, progress);
}

test("avaliações deslocam no desktop e no celular e retomam após o botão", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const section = page.locator("#avaliacoes");
    await section.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const track = section.locator(".review-marquee-track").first();
    const first = await track.evaluate((e) => getComputedStyle(e).transform);
    await expect
      .poll(() => track.evaluate((e) => getComputedStyle(e).transform))
      .not.toBe(first);
    await section.getByRole("button", { name: "Pausar movimento" }).click();
    const paused = await track.evaluate((e) => getComputedStyle(e).transform);
    await page.waitForTimeout(150);
    expect(await track.evaluate((e) => getComputedStyle(e).transform)).toBe(
      paused,
    );
    await section.getByRole("button", { name: "Retomar movimento" }).click();
    await expect
      .poll(() => track.evaluate((e) => getComputedStyle(e).transform))
      .not.toBe(paused);
  }
});

test("vídeo avança e retrocede com rolagem no desktop e no mobile", async ({
  page,
}) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const root = page.locator("#em-movimento"),
      video = root.locator("video");
    await setStoryProgress(page, 0.1);
    await expect(video).toHaveAttribute("src", "/videos/hls-carga-scroll.mp4");
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).readyState))
      .toBeGreaterThanOrEqual(2);
    await expect
      .poll(async () => Number(await root.getAttribute("data-scroll-progress")))
      .toBeGreaterThan(0);
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
      .toBeGreaterThan(0.8);
    const early = await video.evaluate(
      (v) => (v as HTMLVideoElement).currentTime,
    );
    await setStoryProgress(page, 0.8);
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
      .toBeGreaterThan(early + 3);
    const late = await video.evaluate(
      (v) => (v as HTMLVideoElement).currentTime,
    );
    await expect(root.locator(".story-chapter").nth(2)).toHaveAttribute(
      "data-active",
      "true",
    );
    await root.getByRole("button", { name: "Pausar animação" }).click();
    await setStoryProgress(page, 0.2);
    expect(
      await video.evaluate((v) => (v as HTMLVideoElement).currentTime),
    ).toBeCloseTo(late, 1);
    await root.getByRole("button", { name: "Retomar animação" }).click();
    await expect
      .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
      .toBeLessThan(late - 2);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(video).toHaveJSProperty("muted", true);
    await expect(video).toHaveJSProperty("paused", true);
  }
});

test("movimento reduzido mantém fotos e vídeo acessíveis sem scrubbing automático", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const root = page.locator("#em-movimento");
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveClass(/is-reduced/);
  await expect(root.locator("video")).not.toHaveAttribute("src");
  await expect(
    root.getByRole("link", { name: "Assistir com áudio" }),
  ).toHaveAttribute("href", "#video-carga");
  await expect(
    root.getByRole("button", { name: "Pausar animação" }),
  ).toHaveCount(0);
  await expect(page.locator(".material-photo img")).toHaveCount(3);
  await expect(page.locator(".material-photo img").first()).toHaveAttribute(
    "srcset",
    /3840w/,
  );
  await page
    .getByRole("button", { name: "Reproduzir Uma carga da HLS em movimento" })
    .click();
  await expect(page.locator("#video-carga video")).toHaveJSProperty(
    "paused",
    false,
  );
  await expect(page.locator("#video-carga video")).toHaveJSProperty(
    "muted",
    false,
  );
});

test("toque móvel rola a cena e altera o quadro do vídeo sem prender a página", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.bringToFront();
  await page.goto("http://127.0.0.1:5173/");
  await setStoryProgress(page, 0.2);
  const video = page.locator("#em-movimento video");
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).readyState))
    .toBeGreaterThanOrEqual(2);
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(1);
  const before = await video.evaluate(
    (v) => (v as HTMLVideoElement).currentTime,
  );
  const scrollBefore = await page.evaluate(() => scrollY);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 35, y: 640 }],
  });
  for (let i = 1; i <= 8; i++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 35, y: 640 - i * 32 }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(scrollBefore + 100);
  await expect
    .poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(before + 0.5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await context.close();
});
