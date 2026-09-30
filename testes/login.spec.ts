import { test, expect } from '@playwright/test';
import { ambiente } from '../configuracao/ambiente';
import { PaginaLogin } from '../paginas/PaginaLogin';
import { PaginaProdutos } from '../paginas/PaginaProdutos';
import { casosInvalidos,mensagemCredenciais } from '../dados/loginDados';

test.describe('Login', () => {
  let login: PaginaLogin;
  let produtos: PaginaProdutos;

  test.beforeEach(async ({ page: pagina }) => {
    login = new PaginaLogin(pagina);
    produtos = new PaginaProdutos(pagina);
    await login.abrir();
  });

  const perfis = [
    { nome: 'Padrão', usuario: ambiente.usuarioPadrao },
    { nome: 'Problemático', usuario: ambiente.usuarioProblematico },
    { nome: 'Erro', usuario: ambiente.usuarioErro },
    { nome: 'Visual', usuario: ambiente.usuarioVisual },
  ];

  for (const perfil of perfis) {
    test.describe(perfil.nome, () => {
      test('Entrar com credenciais válidas', async ({ page: pagina }) => {
        await test.step('Fazer login', async () => {
          await login.entrar(perfil.usuario, ambiente.senha);
        });
        await test.step('Confirmar o acesso', async () => {
          await expect(pagina).toHaveURL(/\/inventory\.html$/);
          await expect(produtos.locators.titulo).toHaveText('Products');
          await expect(login.locators.botaoEntrar).not.toBeVisible();
        });
      });
    });
  }

  test.describe('Validações', () => {
    for (const caso of casosInvalidos) {
      test(caso.titulo, async ({ page: pagina }) => {
        await login.entrar(caso.usuario, caso.senha);
        await expect(login.locators.mensagemErro).toHaveText(caso.mensagem);
        await expect(pagina).toHaveURL(new URL('/', ambiente.url).href);
        await expect(login.locators.botaoEntrar).toBeVisible();
        await expect(produtos.locators.titulo).not.toBeVisible();
      });
    }
  });

  test('Entrar após corrigir a senha', async ({ page: pagina }) => {
    await test.step('Tentar entrar com senha incorreta', async () => {
      await login.entrar(ambiente.usuarioPadrao, ambiente.senhaIncorreta);
      await expect(login.locators.mensagemErro).toHaveText(mensagemCredenciais);
    });
    await test.step('Corrigir a senha e entrar novamente', async () => {
      await login.entrar(ambiente.usuarioPadrao, ambiente.senha);
      await expect(pagina).toHaveURL(/\/inventory\.html$/);
      await expect(produtos.locators.titulo).toHaveText('Products');
      await expect(login.locators.mensagemErro).not.toBeVisible();
    });
  });

  test('Concluir o login em até 3 segundos', async ({ page: pagina }, resultado) => {
    await login.preencher(ambiente.usuarioLento, ambiente.senha);
    const inicio = performance.now();
    await login.enviar();
    await expect(produtos.locators.titulo).toHaveText('Products', { timeout: 15_000 });
    const duracao = Math.round(performance.now() - inicio);
    await expect(pagina).toHaveURL(/\/inventory\.html$/);

    await resultado.attach('Tempo do login', {
      body: `Esperado: até 3000 ms. Obtido: ${duracao} ms.`,
      contentType: 'text/plain',
    });
    
    expect(duracao, 'Tempo do login em milissegundos').toBeLessThanOrEqual(3000);
  });
});
