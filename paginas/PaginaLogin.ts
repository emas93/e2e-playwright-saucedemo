import { type Page } from '@playwright/test';
import { loginLocators } from '../locators/login.locators';

export class PaginaLogin {
  readonly locators: ReturnType<typeof loginLocators>;

  constructor(private pagina: Page) {
    this.locators = loginLocators(pagina);
  }

  async abrir() {
    await this.pagina.goto('/');
  }

  async preencher(usuario: string, senha: string) {
    await this.locators.campoUsuario.fill(usuario);
    await this.locators.campoSenha.fill(senha);
  }

  async enviar() {
    await this.locators.botaoEntrar.click();
  }

  async entrar(usuario: string, senha: string) {
    await this.preencher(usuario, senha);
    await this.enviar();
  }
}
