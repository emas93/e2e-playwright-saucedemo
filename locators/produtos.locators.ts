import { type Page } from '@playwright/test';

export function produtosLocators(pagina: Page) {
  return { titulo: pagina.getByTestId('title') };
}
