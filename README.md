# E2E Playwright: SauceDemo

Testes end-to-end de login do [SauceDemo](https://www.saucedemo.com), escritos com **Playwright** e **TypeScript**, seguindo o **Page Object Pattern**.

## O que o projeto cobre

O fluxo de login é testado em 12 cenários: acesso com perfis válidos, mensagens de erro, correção de senha e tempo de resposta do login.

| Cenário | Usuário | Resultado esperado |
|---|---|---|
| Login válido (4 perfis) | `standard_user`, `problem_user`, `error_user`, `visual_user` | Vai para `/inventory.html` e exibe o título "Products" |
| Conta bloqueada | `locked_out_user` | Mensagem de usuário bloqueado |
| Usuário inexistente | usuário que não existe | Mensagem de credenciais inválidas |
| Senha incorreta | `standard_user` + senha errada | Mensagem de credenciais inválidas |
| Usuário obrigatório | campo vazio | "Username is required" |
| Senha obrigatória | campo vazio | "Password is required" |
| Campos vazios | ambos vazios | "Username is required" |
| Corrigir a senha | senha errada e depois certa | Erro na primeira tentativa e acesso na segunda |
| Tempo de login | `performance_glitch_user` | Login concluído em até 3 segundos |

Nos cenários de erro, os testes também confirmam que o usuário continua na tela de login e que a página de produtos não aparece.

## Tecnologias

- [Playwright](https://playwright.dev) (`@playwright/test`)
- TypeScript
- Node.js (usa `process.loadEnvFile`, então precisa da versão **20.12 ou superior**)
- GitHub Actions (execução automática dos testes)

## Estrutura

```
.
├── .github/workflows/testes.yml   # pipeline de CI
├── configuracao/ambiente.ts       # leitura e validação das variáveis do .env
├── dados/loginDados.ts            # casos de teste de login inválido
├── locators/                      # seletores de cada página
│   ├── login.locators.ts
│   └── produtos.locators.ts
├── paginas/                       # Page Objects (ações de cada página)
│   ├── PaginaLogin.ts
│   └── PaginaProdutos.ts
├── testes/login.spec.ts           # cenários de teste
├── playwright.config.ts           # configuração do Playwright
├── tsconfig.json
└── package.json
```

### Como as camadas se conectam

- **locators**: só localizam elementos (por `data-test`, via `getByTestId`).
- **paginas**: usam os locators e expõem ações do usuário (`abrir`, `preencher`, `enviar`, `entrar`).
- **testes**: montam o cenário e fazem as **asserções**. Nenhum `expect` fica dentro dos Page Objects.
- **dados**: concentram os casos de erro, então adicionar um novo caso não exige escrever outro teste.
- **configuracao**: valida o `.env` e falha com uma mensagem clara se faltar alguma variável.

## Como rodar

### 1. Pré-requisitos

- Node.js 20.12 ou superior
- Google Chrome instalado. O projeto usa `channel: 'chrome'`; para usar o Chromium do Playwright, remova essa linha do `playwright.config.ts` e rode `npx playwright install chromium`.

### 2. Instalar as dependências

```bash
npm ci
```

### 3. Configurar o ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo. Os valores são as credenciais públicas de demonstração do SauceDemo.

| Variável | Descrição |
|---|---|
| `BASE_URL` | Endereço do site (`https://www.saucedemo.com`) |
| `USUARIO_PADRAO` | `standard_user` |
| `USUARIO_BLOQUEADO` | `locked_out_user` |
| `USUARIO_PROBLEMATICO` | `problem_user` |
| `USUARIO_LENTO` | `performance_glitch_user` |
| `USUARIO_ERRO` | `error_user` |
| `USUARIO_VISUAL` | `visual_user` |
| `SENHA` | Senha dos usuários de demonstração (`secret_sauce`) |
| `USUARIO_INEXISTENTE` | Qualquer usuário que não exista |
| `SENHA_INCORRETA` | Qualquer senha errada |

### 4. Executar os testes

```bash
npm test                                   # roda todos os testes
npx playwright test --headed               # mostra o navegador
npx playwright test --ui                   # modo interativo, com passo a passo
npx playwright test -g "senha incorreta"   # roda um teste pelo nome
npm run verificar                          # checa os tipos do TypeScript, sem executar
```

## Relatório

Ao final de cada execução, o Playwright gera um relatório HTML na pasta `playwright-report/`. Para abrir:

```bash
npm run relatorio
```

O relatório mostra:

- status e duração de cada teste, com os passos (`test.step`) agrupados;
- em caso de falha, **screenshot**, **trace** (navegação passo a passo) e a mensagem de erro;
- o tempo medido no teste de login, anexado como "Tempo do login".

## Integração contínua

O workflow `.github/workflows/testes.yml` roda a cada `push`, `pull request` ou manualmente. Ele instala as dependências e o Chromium, verifica o TypeScript, executa os testes e salva o relatório como artefato por 14 dias.

## Boas práticas adotadas

- Page Object Pattern, com locators separados das ações.
- Asserções fora dos Page Objects.
- Seletores estáveis (`data-test`), sem depender de CSS ou de posição na página.
- Asserções web-first (`toHaveText`, `toHaveURL`, `toBeVisible`), que esperam sozinhas, sem `waitForTimeout`.
- Testes independentes entre si, cada um começando pela tela de login.
- Testes orientados a dados para os casos de erro.
- TypeScript em modo `strict` e configuração validada no início da execução.

## Falha conhecida

O teste **"Concluir o login em até 3 segundos"** usa o `performance_glitch_user`, que o SauceDemo atrasa de propósito. Na última execução registrada, o login levou mais que os 3 segundos esperados e o teste falhou. Esse é o cenário que demonstra como o relatório exibe uma falha (erro, screenshot e trace).

## Problemas comuns no Windows

- **`npm.ps1 não pode ser carregado`**: rode `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` no PowerShell.
- **`browserType.launch: spawn UNKNOWN`** ao rodar pelo Git Bash: execute os comandos pelo PowerShell ou pelo cmd.
