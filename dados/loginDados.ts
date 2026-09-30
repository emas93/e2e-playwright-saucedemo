import { ambiente } from '../configuracao/ambiente';

export const mensagemCredenciais =
  'Epic sadface: Username and password do not match any user in this service';

export const casosInvalidos = [
  {
    titulo: 'Impedir o acesso de conta bloqueada',
    usuario: ambiente.usuarioBloqueado,
    senha: ambiente.senha,
    mensagem: 'Epic sadface: Sorry, this user has been locked out.',
  },
  {
    titulo: 'Recusar usuário inexistente',
    usuario: ambiente.usuarioInexistente,
    senha: ambiente.senha,
    mensagem: mensagemCredenciais,
  },
  {
    titulo: 'Recusar senha incorreta',
    usuario: ambiente.usuarioPadrao,
    senha: ambiente.senhaIncorreta,
    mensagem: mensagemCredenciais,
  },
  {
    titulo: 'Solicitar usuário obrigatório',
    usuario: '',
    senha: ambiente.senha,
    mensagem: 'Epic sadface: Username is required',
  },
  {
    titulo: 'Solicitar senha obrigatória',
    usuario: ambiente.usuarioPadrao,
    senha: '',
    mensagem: 'Epic sadface: Password is required',
  },
  {
    titulo: 'Validar os dois campos vazios',
    usuario: '',
    senha: '',
    mensagem: 'Epic sadface: Username is required',
  },
];