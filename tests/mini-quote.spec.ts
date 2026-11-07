import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function next(page: Page) {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Continuar", exact: true })
    .click();
}
async function fillReceiving(page: Page) {
  await page.getByRole("textbox", { name: "Cidade" }).fill("Blumenau");
  await page.getByRole("textbox", { name: "Bairro" }).fill("Passo Manso");
  await page.getByLabel("Retirada", { exact: true }).check();
  await page.getByLabel("Estou planejando", { exact: true }).check();
}

test("miniquestionário HLS: orientação, resumo editável e respostas preservadas", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page
    .getByRole("button", { name: "Quero cotar minha obra", exact: true })
    .first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const progress = dialog.getByRole("progressbar");
  await expect(progress).toHaveAttribute("max", "3");
  await expect(progress).toHaveAttribute("value", "1");
  await page
    .getByRole("checkbox", {
      name: "Preciso de orientação para escolher",
    })
    .check();
  await page
    .getByLabel("Etapa da obra (opcional)", { exact: true })
    .selectOption({ label: "Laje" });
  await page
    .getByRole("textbox", {
      name: "Medidas, quantidades ou dúvidas (opcional)",
      exact: true,
    })
    .fill("Preciso de orientação sobre tela e aço.");
  await next(page);
  await expect(progress).toHaveAttribute("value", "2");
  await fillReceiving(page);
  await next(page);
  await expect(progress).toHaveAttribute("value", "3");
  await expect(
    dialog.getByRole("heading", {
      name: "Seu próximo passo com a HLS.",
      exact: true,
    }),
  ).toBeFocused();
  await expect(dialog).toContainText("Laje");
  await expect(dialog).toContainText("Preciso de orientação sobre tela e aço.");
  await page.getByRole("textbox", { name: "Seu nome" }).fill("Álvaro & Obra");
  await page.getByRole("textbox", { name: "Empresa" }).fill("Construtora A&B");

  await dialog
    .getByRole("button", { name: "Editar materiais", exact: true })
    .click();
  await expect(
    page.getByRole("checkbox", {
      name: "Preciso de orientação para escolher",
    }),
  ).toBeChecked();
  await expect(
    page
      .getByLabel("Etapa da obra (opcional)", { exact: true })
      .locator("option:checked"),
  ).toHaveText("Laje");
  await page
    .getByLabel("Etapa da obra (opcional)", { exact: true })
    .selectOption({ label: "Fundação" });
  await next(page);
  await expect(page.getByLabel("Retirada", { exact: true })).toBeChecked();
  await next(page);
  await dialog
    .getByRole("button", { name: "Editar entrega", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Cidade" }).fill("Itajaí");
  await page.getByLabel("Entrega", { exact: true }).check();
  await next(page);

  const link = dialog.getByRole("link", {
    name: "Quero cotar no WhatsApp",
    exact: true,
  });
  const url = new URL((await link.getAttribute("href"))!);
  expect(url.origin + url.pathname).toBe("https://wa.me/554733306633");
  const message = url.searchParams.get("text")!;
  expect(message).toContain("Álvaro & Obra");
  expect(message).toContain("Construtora A&B");
  expect(message).toContain("Fundação");
  expect(message).toContain("Itajaí");
  expect(message).toContain("Entrega");
  expect(message).not.toContain("Recebimento: Retirada");
  expect(message).toMatch(/orientação/i);
  expect(message).not.toContain("Categorias: \n");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);

  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByRole("textbox", { name: "Seu nome" })).toHaveValue(
    "Álvaro & Obra",
  );
  await expect(progress).toHaveAttribute("value", "3");
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});

test("miniquestionário: categoria basta e Enter valida nome sem abrir WhatsApp", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Orçamento rápido" }).click();
  const dialog = page.getByRole("dialog");
  await page
    .getByRole("checkbox", { name: "Tela Soldada", exact: true })
    .check();
  await next(page);
  await fillReceiving(page);
  await next(page);
  const name = page.getByRole("textbox", { name: "Seu nome" });
  await name.fill("   ");
  await name.press("Enter");
  await expect(dialog.getByRole("alert")).toContainText("chamar");
  await expect(
    dialog.getByRole("link", { name: "Quero cotar no WhatsApp", exact: true }),
  ).toHaveCount(0);
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await name.fill("Cliente & Reforma");
  await name.press("Enter");
  const link = dialog.getByRole("link", {
    name: "Quero cotar no WhatsApp",
    exact: true,
  });
  await expect(link).toBeFocused();
  const message = new URL((await link.getAttribute("href"))!).searchParams.get(
    "text",
  )!;
  expect(message).toContain("Tela Soldada");
  expect(message).toContain("Cliente & Reforma");
  expect(message).not.toContain("Empresa:");
  expect(message).not.toContain("Medidas, quantidades");
  expect(context.pages()).toHaveLength(1);
  expect(new URL(page.url()).hostname).toBe("127.0.0.1");
});

test("miniquestionário móvel: orientação sem medidas e resumo acessível", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Quero cotar minha obra", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await page
    .getByRole("checkbox", {
      name: "Preciso de orientação para escolher",
    })
    .check();
  await next(page);
  await fillReceiving(page);
  await next(page);
  await page.getByRole("textbox", { name: "Seu nome" }).fill("Maria");
  await expect(
    dialog.getByRole("link", { name: "Quero cotar no WhatsApp", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  expect(
    await dialog.evaluate((node) => node.scrollWidth <= node.clientWidth),
  ).toBeTruthy();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
