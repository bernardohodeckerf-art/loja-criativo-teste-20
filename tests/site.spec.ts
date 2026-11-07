import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("catálogo: categorias, medidas, busca sem acentos, estado vazio e lista", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  const filter = page.getByLabel("Filtrar categoria");
  await filter.selectOption("");
  await expect(page.locator(".product-card")).toHaveCount(73);
  await filter.selectOption("pregos");
  await expect(page.locator(".product-card")).toHaveCount(24);
  const photo = page.locator(".category-photo img");
  await photo.scrollIntoViewIfNeeded();
  await expect
    .poll(() => photo.evaluate((i) => (i as HTMLImageElement).naturalWidth))
    .toBeGreaterThan(0);
  await expect(photo).toHaveAttribute("src", "/images/nails-small.webp");
  await page.getByRole("searchbox").fill("caixaria");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card")).toContainText("16x24");
  await page.getByRole("searchbox").fill("nao-existe-345");
  await expect(page.getByText("Vamos tentar outra medida?")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.locator(".product-card")).toHaveCount(73);
  await page.getByRole("searchbox").fill("aco 6,3");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card")).toContainText("6.3 mm - 1/4");
  await page.getByRole("button", { name: /Adicionar à lista:/ }).click();
  await expect(
    page.getByRole("button", { name: /Na sua lista:/ }),
  ).toBeDisabled();
});
test("questionário: validação, quantidades, retorno, revisão e URL segura", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Filtrar categoria").selectOption("pregos");
  await page
    .locator(".product-card")
    .first()
    .getByRole("button", { name: /Adicionar à lista:/ })
    .click();
  const trigger = page.getByRole("button", {
    name: "Minha lista (1)",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const next = () =>
    dialog.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "O que sua obra precisa?" }),
  ).toBeFocused();
  await page
    .getByLabel("Quantidade de Prego 10x10", { exact: true })
    .fill("-1");
  await next();
  await expect(page.getByRole("alert")).toContainText("maiores que zero");
  await page.getByLabel("Quantidade de Prego 10x10", { exact: true }).fill("5");
  await page
    .getByLabel("Unidade de Prego 10x10", { exact: true })
    .selectOption("kg");
  await next();
  await expect(
    dialog.getByRole("heading", { name: "Onde e quando você precisa?" }),
  ).toBeFocused();
  await next();
  await expect(page.getByRole("alert")).toContainText("cidade");
  await page.getByRole("textbox", { name: "Cidade" }).fill("Blumenau");
  await page.getByLabel("Entrega", { exact: true }).check();
  await next();
  await expect(page.getByRole("alert")).toContainText("quando");
  await page.getByLabel("Nesta semana", { exact: true }).check();
  await next();
  await dialog
    .getByRole("button", { name: "Quero cotar no WhatsApp", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("chamar");
  await page.getByRole("textbox", { name: "Seu nome" }).fill("João & Obra");
  await dialog.getByRole("button", { name: "Voltar", exact: true }).click();
  await expect(page.getByLabel("Nesta semana", { exact: true })).toBeChecked();
  await next();
  await expect(page.getByRole("textbox", { name: "Seu nome" })).toHaveValue(
    "João & Obra",
  );
  const href = await dialog
    .getByRole("link", { name: "Quero cotar no WhatsApp", exact: true })
    .getAttribute("href");
  const url = new URL(href!);
  expect(url.origin + url.pathname).toBe("https://wa.me/554733306633");
  expect(url.searchParams.get("text")).toContain("Prego 10x10 — 5 kg");
  expect(url.searchParams.get("text")).toContain("João & Obra");
  expect(url.searchParams.get("text")).not.toContain("Empresa:");
  await expect(
    page.getByText("Você poderá revisar e enviar a mensagem no WhatsApp."),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test("acessibilidade automatizada: página e diálogo", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Escape");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Orçamento rápido" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test("mobile e teclado: menu, carrossel, filtros e ausência de overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Fechar menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Abrir menu", exact: true }),
  ).toBeFocused();
  const carousel = page.getByRole("region", {
    name: "Categorias de ferragens",
  });
  const frame = carousel.locator('[tabindex="0"]');
  await frame.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    carousel.getByText("Pregos e grampos", { exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(
    carousel.getByText("Aço · Barras", { exact: true }),
  ).toBeVisible();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
});
test("movimento reduzido, mídia local e segurança proporcional", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".hero video")).toHaveJSProperty("paused", true);
  await expect(page.locator(".hero video source")).toHaveCount(0);
  const carousel = page.getByRole("region", {
    name: "Categorias de ferragens",
  });
  await carousel.getByRole("button", { name: "Próxima categoria" }).click();
  await expect(
    carousel.getByText("Pregos e grampos", { exact: true }),
  ).toBeVisible();
  for (const asset of [
    "/images/hls-logo.png",
    "/images/nails.webp",
    "/images/hero-poster.webp",
    "/videos/hero-desktop.webm",
    "/videos/hero-mobile.mp4",
  ]) {
    const res = await request.get(asset);
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["content-type"]).not.toContain("text/html");
  }
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  );
  expect(errors).toEqual([]);
});
test("mouse: elevação, alvo magnético estável e pausa do vídeo fora da hero", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const cta = page.getByRole("button", {
    name: "Pedir orçamento",
    exact: true,
  });
  const before = await cta.boundingBox();
  await page.mouse.move(
    before!.x + before!.width - 10,
    before!.y + before!.height / 2,
  );
  await expect.poll(() => cta.boundingBox()).toEqual(before);
  await expect
    .poll(() =>
      cta.locator("span").evaluate((e) => getComputedStyle(e).transform),
    )
    .not.toBe("none");
  const card = page.locator(".product-card").first();
  await card.hover();
  await expect
    .poll(() => card.evaluate((e) => getComputedStyle(e).transform))
    .not.toBe("none");
  await expect(page.locator(".hero video")).toHaveJSProperty("paused", true);
});
test("carrossel: paginação, arraste e cancelamento preservam navegação", async ({
  page,
}) => {
  await page.goto("/");
  const carousel = page.getByRole("region", {
    name: "Categorias de ferragens",
  });
  await carousel.getByRole("button", { name: "Ver Arame recozido" }).click();
  await expect(
    carousel.getByText("Arame recozido", { exact: true }),
  ).toBeVisible();
  const frame = carousel.locator('[tabindex="0"]');
  await frame.scrollIntoViewIfNeeded();
  const b = await frame.boundingBox();
  await page.mouse.move(b!.x + b!.width * 0.5, b!.y + b!.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(b!.x + b!.width * 0.5 - 180, b!.y + b!.height * 0.5, {
    steps: 12,
  });
  await page.mouse.up();
  await frame.dispatchEvent("pointercancel", { pointerId: 1, clientX: 0 });
  await carousel.getByRole("button", { name: "Ver Pregos e grampos" }).click();
  await expect(
    carousel.getByText("Pregos e grampos", { exact: true }),
  ).toBeVisible();
});
test("coverflow: zero/um slide e falha de imagem sem controles inválidos", async ({
  page,
}) => {
  await page.route("**/src/App.tsx*", async (route) => {
    const original = await (await route.fetch()).text();
    const reactPath = original.match(/from "([^" ]*\/react\.js[^" ]*)"/)?.[1];
    if (!reactPath)
      throw new Error("React module path missing in Vite transform");
    return route.fulfill({
      contentType: "application/javascript",
      body: `import React from '${reactPath}';import {CoverflowCarousel} from '/src/components/ui/coverflow-carousel.tsx';export default function App(){return React.createElement('main',null,React.createElement(CoverflowCarousel,{slides:[],showNavigation:true,showPagination:true,label:'Empty'}),React.createElement(CoverflowCarousel,{slides:[{src:'/missing-test-image.png',alt:'Unavailable',title:'Single'}],showCaption:true,showNavigation:true,showPagination:true,label:'Single'}));}`,
    });
  });
  await page.route("**/missing-test-image.png", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Empty" })).toHaveCount(0);
  const single = page.getByRole("region", { name: "Single" });
  await expect(single).toBeVisible();
  await expect(single.getByRole("button")).toHaveCount(0);
  const card = single.locator('[role="group"]');
  await expect(card).toHaveCSS("opacity", "1");
  await expect(card).toHaveAttribute("data-image-error", "true");
  expect(await card.evaluate((e) => e.style.transform)).not.toContain("NaN");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(single.getByText("Single", { exact: true })).toBeVisible();
});
test("questionário vazio e remoção de item não permitem avançar sem material", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Orçamento rápido" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Selecione uma categoria",
  );
  await page.keyboard.press("Escape");
  await page.getByLabel("Filtrar categoria").selectOption("pregos");
  await page
    .locator(".product-card")
    .first()
    .getByRole("button", { name: /Adicionar à lista:/ })
    .click();
  await page
    .getByRole("button", { name: "Minha lista (1)", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Remover Prego 10x10", exact: true })
    .click();
  await expect(dialog.locator(".interest-item")).toHaveCount(0);
  await dialog.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Selecione uma categoria",
  );
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Minha lista (0)", exact: true }),
  ).toBeVisible();
});
test("touch móvel: menu e arraste mantêm a rolagem vertical", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5173/");
  await page.getByRole("button", { name: "Abrir menu", exact: true }).tap();
  await page
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("link", { name: "Produtos", exact: true })
    .tap();
  await expect(
    page.getByRole("button", { name: "Abrir menu", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  const carousel = page.getByRole("region", {
    name: "Categorias de ferragens",
  });
  const frame = carousel.locator('[tabindex="0"]');
  await frame.scrollIntoViewIfNeeded();
  const b = await frame.boundingBox();
  const cdp = await context.newCDPSession(page);
  const x = b!.x + b!.width * 0.75,
    y = b!.y + b!.height * 0.5;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let n = 1; n <= 8; n++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - n * 24, y }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(
    carousel.getByRole("button", { name: "Ver Pregos e grampos" }),
  ).toHaveAttribute("aria-current", "true");
  const oldY = await page.evaluate(() => scrollY);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 195, y: 650 }],
  });
  for (let n = 1; n <= 8; n++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 195, y: 650 - n * 35 }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(oldY);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await context.close();
});
