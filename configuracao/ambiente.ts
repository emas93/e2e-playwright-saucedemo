import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';

loadEnvFile(resolve(__dirname, '../.env'));

function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Preencha ${nome} no arquivo .env.`);
  return valor;
}

export const ambiente = {
  url: obrigatoria('BASE_URL'),
  usuarioPadrao: obrigatoria('USUARIO_PADRAO'),
  usuarioBloqueado: obrigatoria('USUARIO_BLOQUEADO'),
  usuarioProblematico: obrigatoria('USUARIO_PROBLEMATICO'),
  usuarioLento: obrigatoria('USUARIO_LENTO'),
  usuarioErro: obrigatoria('USUARIO_ERRO'),
  usuarioVisual: obrigatoria('USUARIO_VISUAL'),
  senha: obrigatoria('SENHA'),
  usuarioInexistente: obrigatoria('USUARIO_INEXISTENTE'),
  senhaIncorreta: obrigatoria('SENHA_INCORRETA'),
};
