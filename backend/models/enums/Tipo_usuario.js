const TipoUsuario = Object.freeze({
  ALUNO: 'aluno',
  PROFESSOR: 'professor',
  ADM: 'adm'
});

module.exports = TipoUsuario;

/*Tipo_Usuario tem como função garantir uma maior segurança na lógica do sistema.
Utilizamos esse enum para restringir os tipos de usuários possíveis na instanciação, mesmo que
não seja possível que um usuário infrinja essa regra diretamente. Basicamente, é uma prevenção de erros
no funcionamento do programa.*/