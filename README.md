# PROJETO INTEGRADOR INTERDISCIPLINAR (PII): TRILHO-DO-CONHECIMENTO (METRÔ SP)

Este projeto tem como objetivo gerenciar o emissor de certificados para o metrô de São Paulo, desenvolvido como Projeto Integrador Interdisciplinar (PII). 
O sistema permite o controle de cursos, turmas, listas de presença e histórico de treinamentos.

## Integrantes

|Alunos                    | R.A          | Github              |Cargo          |
|--------------------------|--------------|---------------------|---------------|
| Larissa Gomes            | 25.00625-5   | @gLariii            | Desenvolvedor |
| Guilherme Araújo         | 25.00615-6   | @Guilherme-p2006    | Desenvolvedor |
| Luana Ferreira Silva     | 25.01656-9   | @luafxrreira        | Desenvolvedor |
| Thiago Santos Machado    | 25.01702-1   | @Thiago-stosm       | Desenvolvedor |
| Victor Zakimi            | 23.00187-9   | @Victor-Hugo-PZ     | Desenvolvedor |
| Lucas Scudeler de Andrade| 25.00079-5   | @lucasdeandrade13   | Desenvolvedor |

## Estrutura do projeto

```
📁 TRILHO-DO-CONHECIMENTO
│── 📁 backend
│   │── 📁 connectionFactory        # Conexão com o banco
│   │   │── 📄connectionFactory.js
│   │── 📁 DAO                      # Data Access Objects
│   │   │── 📄CertificadoDAO.js
│   │   │── 📄CursoDAO.js
│   │   │── 📄lista_presenca_usuarioDAO.JS
│   │   │── 📄lista_presencaDAO.js
│   │   │── 📄TurmaDAO.js
│   │   │── 📄UsuarioDAO.js
│   │── 📁 database                 # Scripts SQL
│   │   │── 📄bdPI4.sql
│   │   │── 📄winstonlogs.sql
│   │── 📁 externalServices         # Arquivos da API
│   │   │── 📄base64.html
│   │   │── 📄clickSignService.js
│   │── 📁 frontend                  
│   │   │── 📁 assets               # Imagens
│   │   │   │── 📄homem2.png  
│   │   │   │── 📄logo metro.png 
│   │   │   │── 📄logo-IMT.png 
│   │   │   │── 📄logo.png  
│   │   │   │── 📄metro_logo.png 
│   │   │   │── 📄metro-painel.png 
│   │   │   │── 📄operária.png  
│   │   │   │── 📄search_icon.png  
│   │   │── 📁 css                  # Estilos
│   │   │   │── 📄ajuda_style.css
│   │   │   │── 📄cadastrarUsuario_style.css
│   │   │   │── 📄criarListaDePresenca_style.css
│   │   │   │── 📄historicoTreinamentosAluno_style.css
│   │   │   │── 📄institucional_style.css
│   │   │   │── 📄login_style.css
│   │   │   │── 📄menuAdm_style.css
│   │   │   │── 📄menuAluno_style.css
│   │   │   │── 📄menuEuAluno_style.css
│   │   │   │── 📄style.css
│   │   │   │── 📄telaCertificado_style.css
│   │   │   │── 📄treinamentosAdm_style.css
│   │   │── 📁 js
│   │   │   │── 📁 controllers      # Controladores
│   │   │   │   │── 📄cadastrarUsuarioController.js
│   │   │   │   │── 📄criarListaPresencaController.js
│   │   │   │   │── 📄historicoTreinamentosController.js
│   │   │   │   │── 📄loginController.js
│   │   │   │   │── 📄menuAdmController.js
│   │   │   │   │── 📄menuAlunoController.js
│   │   │   │   │── 📄menuEuAluno.js
│   │   │   │   │── 📄treinamentosAdmController.js
│   │   │   │── 📁 listeners        # Event listeners
│   │   │   │   │── 📄cadastrarUsuarioListeners.js
│   │   │   │   │── 📄certificadoListeners.js
│   │   │   │   │── 📄criarListaDePresencaListeners.js
│   │   │   │   │── 📄historicoTreinamentosListeners.js
│   │   │   │   │── 📄institucialAjudaListener.js
│   │   │   │   │── 📄loginListeners.js
│   │   │   │   │── 📄menuAdmListeners.js
│   │   │   │   │── 📄menuAlunoListeners.js
│   │   │   │   │── 📄menuEuAlunoListeners.js
│   │   │   │   │── 📄search.js
│   │   │   │   │── 📄treinamentosAdmListeners.js
│   │   │   │── 📁 services        # Serviços da aplicação
│   │   │   │   │── 📄cadastrarUsuarioService.js
│   │   │   │   │── 📄certificadoService.js
│   │   │   │   │── 📄criarListaPresencaService.js
│   │   │   │   │── 📄historicoTreinamentosService.js
│   │   │   │   │── 📄loginService.js
│   │   │   │   │── 📄menuAdmService.js
│   │   │   │   │── 📄menuAlunoService.js
│   │   │   │   │── 📄menuEuAlunoService.js
│   │   │   │   │── 📄treinamentosAdmService.js
│   │   │── 📁 pages               # Páginas HTML
│   │   │   │── 📄ajuda.html
│   │   │   │── 📄cadastrarUsuario.html
│   │   │   │── 📄criarListaDePresenca.html
│   │   │   │── 📄historicoTreinamentosAluno.html
│   │   │   │── 📄institucional.html
│   │   │   │── 📄menuAdm.html
│   │   │   │── 📄menuAluno.html
│   │   │   │── 📄menuEuAluno.html
│   │   │   │── 📄telaCertificado.html
│   │   │   │── 📄treinamentosAdm.html
│   │   │──📄index.html   
│   │─── 📁 logs                   # Arquivos de log
│   │    │──📄combined.log 
│   │    │──📄error.log  
│   │    │──📄logger.js  
│   │    │──📄mysqlTransport.js  
│   │─── 📁 middlewares            # Autenticação
│   │    │──📄authMiddleware.js       
│   │─── 📁 models                 # Modelos de dados
│   │    │──📄Certificado.js   
│   │    │──📄Curso.js    
│   │    │──📄index.js
│   │    │──📄lista_presenca_usuario.js    
│   │    │──📄Lista_presenca.js    
│   │    │──📄Turma.js    
│   │    │──📄Usuario.js    
│   │─── 📁 routes                 # Rotas da aplicação
│   │    │──📄certificadoRoutes.js  
│   │    │──📄cursoRoutes.js  
│   │    │──📄lista_presencaRoute.js  
│   │    │──📄turmaRoute.js  
│   │    │──📄usuarioRoutes.js 
│   │─── 📁 templates 
│   │    │──📄certificado_0.pdf
│   │─── 📄 server.js  
│── 📁 node_modules                # Dependências
│── 📄.env                         # Variáveis de ambiente
│── 📄.gitignore                   # Ignorados pelo Git
│── 📄package-lock.json            
│── 📄package.json                 # Configs do projeto 
│── 📄README.md                    # Este arquivo
```

## Funcionalidades
**Para administradores** 

- Cadastro de usuários (alunos e administradores)
- Gerenciamento de cursos e turmas
- Criação e controle de listas de presença
- Visualização de treinamentos cadastrados

**Para Alunos**

- Histórico completo de treinamentos realizados
- Visualização e download de certificados
- Consulta de presença em treinamentos

## Tecnologias utilizadas
**Frontend** 
- HTML5 - estrutura das páginas
- CSS3 - estilização e layout responsivo
- JavaScript - lógica e interatividade do cliente

**Backend**
- Node.js - Ambiente de execução JavaScript
- Express.js - Framework web para APIs RESTful
- MySQL (aiven/sequelize) - Banco de dados relacional
- JWT (JSON Web Tokens) - Autenticação e autorização 

## Como executar
**Pré-requisitos**
- Node.js 
- MySQL 
- npm

**Instalação**
1. Clone o repositório e mude o diretório
```bash
git clone https://github.com/seu-usuario/trilho-do-conhecimento.git
cd trilho-do-conhecimento
```
2. Instale o aplicativo node e as dependências
```bash
npm install
npm install -g nodemon
npm install --save-dev nodemon
```
3. Configure as variáveis do ambiente 
```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env
# Edite ele com as configurações necessárias
```
4. Configure o banco de dados 
```bash
# Execute os scripts SQL localizados em backend/database/
mysql -u seu_usuario -p < backend/database/bdPI4.sql
mysql -u seu_usuario -p < backend/database/winstonlogs.sql
```
5. Inicie o servidor
```bash
nodemon backend/server.js
```
6. Acesse a aplicação
```bash
http://localhost:3000
```

## Licença
Este projeto foi desenvolvido como parte do Projeto Integrador Interdisciplinar do Instituto Mauá de Tecnologia em parceria com o Metrô de São Paulo.

## Contato
Para mais informações sobre o projeto, entre em contato com a equipe de desenvolvimento através dos perfis do GitHub listados acima.

_Desenvolvido com foco e dedicação pelos estudantes do IMT._