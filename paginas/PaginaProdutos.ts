import { type Page } from '@playwright/test';
import { produtosLocators } from '../locators/produtos.locators';

export class PaginaProdutos {
  readonly locators: ReturnType<typeof produtosLocators>;

  constructor(pagina: Page) {
    this.locators = produtosLocators(pagina);
  }
}
