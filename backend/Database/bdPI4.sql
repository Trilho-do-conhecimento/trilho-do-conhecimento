/***
Entidades e Atributos

Usuário (genérico)

- id_usuario (PK)
- e-mail
- senha
- nome_completo
- registro
- cargo
- área
- Pode ser aluno/professor/admin
certificados (ligação com Certificado)
treinamentos (como aluno → ligação com Turma)
treinamentos (como instrutor → ligação com Turma)

- Curso
- id_curso (PK)
- nome
- data_inicio
- data_termino
- status (concluído, em andamento, cancelado)
- área
- carga_horaria


Turma

- id_turma (PK)
- horario
- local
- curso (FK → Curso)
- instrutor (FK → Usuário / Professor)

Lista de Presença
- id_lista (PK)
- data
- aluno (FK → Aluno)
- turma (FK → Turma)
- status_assinatura

Certificado
- id_certificado (PK)
- certificador1
- cargo_certificador1
- certificador2
- cargo_certificador2
- nome_concluinte (FK → Aluno / Usuário)
- nome_certificado
- descricao

Relacionamentos

1. Aluno – Turma
- Um Aluno participa de muitas **Turmas**.
- Uma Turma tem muitos Alunos.
- Relacionamento N:N resolvido pela Lista de Presença.

2. Professor – Turma
- Um Professor pode ministrar muitas Turmas.
- Uma Turma tem apenas 1 Professor.
- Relacionamento 1:N.

3. Curso – Turma
- Um Curso pode ter várias Turmas.
- Uma Turma pertence a apenas 1 Curso.
- Relacionamento 1:N.

4. Aluno – Certificado
- Um Aluno pode ter vários Certificados.
- Um Certificado pertence a 1 Aluno.
- Relacionamento 1:N.
***/
drop database if exists metrodb;
CREATE DATABASE IF NOT EXISTS metrodb;
USE metrodb;

-- Usuário genérico (aluno, professor ou admin)
CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    registro VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    tipo_usuario ENUM('aluno', 'professor', 'admin') NOT NULL
);

-- Curso
CREATE TABLE curso (
    id_curso INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_termino DATE NOT NULL,
    status ENUM('concluido', 'em andamento', 'cancelado') NOT NULL,
    area VARCHAR(100) NOT NULL,
    carga_horaria INT NOT NULL
);

-- Turma 
CREATE TABLE turma (
    id_turma INT PRIMARY KEY AUTO_INCREMENT,
    horario DATETIME NOT NULL,
    local VARCHAR(200) NOT NULL,
    id_curso INT NOT NULL,
    id_instrutor INT NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES curso(id_curso),
    FOREIGN KEY (id_instrutor) REFERENCES usuario(id_usuario)
);

-- Relacionamento turma : instrutor
CREATE TABLE instrutor_turma (
    id_usuario INT,
    id_turma INT,
    PRIMARY KEY (id_usuario, id_turma),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
);
-- Criei uma tabela que relaciona instrutores e turmas, por conta do relacionamento N:N

-- Lista de Presença 
CREATE TABLE lista_presenca (
    id_lista INT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    id_turma INT NOT NULL,
    FOREIGN KEY (id_turma) REFERENCES turma(id_turma)
);

-- Alunos presentes na lista de presença 
CREATE TABLE lista_presenca_usuario (
    id_lista INT NOT NULL,
    id_usuario INT NOT NULL,
    status_assinatura ENUM('Presente','Ausente','Justificado') NOT NULL,
    PRIMARY KEY (id_lista, id_usuario),
    FOREIGN KEY (id_lista) REFERENCES lista_presenca(id_lista),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Certificado vinculado ao usuário que concluiu 
CREATE TABLE certificado (
   id_certificado INT PRIMARY KEY AUTO_INCREMENT,
   certificador1 VARCHAR(100) NOT NULL,
   registro_c1 VARCHAR(100) NOT NULL,
   cargo_c1 VARCHAR(100) NOT NULL,
   id_concluinte INT NOT NULL,
   nome_certificado VARCHAR(100) NOT NULL,
   descricao TEXT NOT NULL,
   FOREIGN KEY (id_concluinte) REFERENCES usuario(id_usuario)
);



