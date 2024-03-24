CREATE TABLE Escolas (
    esc_codigo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    esc_nome VARCHAR(255) NOT NULL,
    esc_endereco VARCHAR(255) NOT NULL,
    esc_tipo CHAR NOT NULL
);

CREATE TABLE Responsaveis (
    resp_codigo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    resp_nome VARCHAR(255) NOT NULL,
    resp_rg VARCHAR(20) NOT NULL,
    resp_cpf VARCHAR(14) NOT NULL,
    resp_email VARCHAR(255) NOT NULL,
    resp_telefone VARCHAR(20),
    resp_celular VARCHAR(20) NOT NULL
);

CREATE TABLE Alunos (
    alu_codigo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    alu_nome VARCHAR(255) NOT NULL,
    alu_rg VARCHAR(20) NOT NULL,
    alu_observacoes VARCHAR(255),
    alu_datanasc DATE NOT NULL
);
