CREATE TABLE escola (
    esc_codigo INT PRIMARY KEY,
    esc_nome VARCHAR(100),
    esc_tipo CHAR(1), 
    esc_email VARCHAR(100),
    esc_telefone VARCHAR(15), 
    esc_ponto_de_embarque_cod INT,
    FOREIGN KEY (esc_ponto_de_embarque_cod) 
        REFERENCES pontos_de_embarque(pde_cod)
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
