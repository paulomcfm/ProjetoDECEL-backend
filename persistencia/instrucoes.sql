CREATE TABLE Escolas (
    esc_codigo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    esc_nome VARCHAR(255) NOT NULL,
    esc_tipo CHAR NOT NULL,
    esc_rua VARCHAR(255) NOT NULL,
    esc_numero INT NOT NULL,
    esc_cidade VARCHAR(255) NOT NULL,
    esc_bairro VARCHAR(255) NOT NULL,
    esc_cep VARCHAR(35) NOT NULL,
    esc_email VARCHAR(255) NOT NULL,
    esc_telefone VARCHAR(20) NOT NULL
);

CREATE TABLE Responsaveis (
    resp_codigo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    resp_nome VARCHAR(255) NOT NULL,
    resp_rg VARCHAR(20) NOT NULL UNIQUE,
    resp_cpf VARCHAR(14) NOT NULL UNIQUE,
    resp_email VARCHAR(255) NOT NULL,
    resp_telefone VARCHAR(20),
    resp_celular VARCHAR(20) NOT NULL
);

CREATE TABLE Alunos (
    alu_codigo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    alu_nome VARCHAR(255) NOT NULL,
    alu_rg VARCHAR(20) NOT NULL UNIQUE,
    alu_observacoes VARCHAR(255),
    alu_datanasc DATE NOT NULL
);

CREATE TABLE Parentescos (
    alu_codigo INT NOT NULL,
    resp_codigo INT NOT NULL,
    par_parentesco VARCHAR(45) NOT NULL,
    CONSTRAINT pk_parentesco PRIMARY KEY (alu_codigo, resp_codigo),
    CONSTRAINT fk_aluparentesco FOREIGN KEY (alu_codigo) REFERENCES Alunos(alu_codigo) ON DELETE CASCADE,
    CONSTRAINT fk_respparentesco FOREIGN KEY (resp_codigo) REFERENCES Responsaveis(resp_codigo) ON DELETE CASCADE
);

CREATE TABLE Usuarios (
    user_codigo INT NOT NULL,
    user_login VARCHAR(100) NOT NULL,
    user_senha VARCHAR(255) NOT NULL,
    user_cpf VARCHAR(14) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_celular VARCHAR(20) NOT NULL,
    user_categoria VARCHAR(11) NOT NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (user_codigo)
)