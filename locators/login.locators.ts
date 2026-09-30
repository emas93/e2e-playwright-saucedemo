import { type Page } from '@playwright/test';

export function loginLocators(pagina: Page) {
  return {
    campoUsuario: pagina.getByTestId('username'),
    campoSenha: pagina.getByTestId('password'),
    botaoEntrar: pagina.getByTestId('login-button'),
    mensagemErro: pagina.getByTestId('error'),
  };
}
