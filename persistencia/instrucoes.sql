CREATE TABLE Usuarios (
    user_nome VARCHAR(100) NOT NULL UNIQUE,
    user_senha VARCHAR(255) NOT NULL,
    user_cpf VARCHAR(14) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_celular VARCHAR(20) NOT NULL,
    CONSTRAINT pk_usuarios PRIMARY KEY (user_cpf)
);

CREATE TABLE PasswordResetCodes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    codigo_redefinicao VARCHAR(6) NOT NULL,
    data_codigo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES Usuarios(user_email)
);

CREATE TABLE Veiculos (
  vei_codigo SERIAL PRIMARY KEY,
  vei_renavam VARCHAR(11) NOT NULL UNIQUE,
  vei_placa VARCHAR(7) NOT NULL,
  vei_modelo VARCHAR(45) NOT NULL,
  vei_capacidade INT NOT NULL,
  vei_tipo CHAR NOT NULL
);

CREATE TABLE Responsaveis (
    resp_codigo SERIAL PRIMARY KEY,
    resp_nome VARCHAR(255) NOT NULL,
    resp_rg VARCHAR(20) NOT NULL UNIQUE,
    resp_cpf VARCHAR(14) NOT NULL UNIQUE,
    resp_email VARCHAR(255) NOT NULL,
    resp_telefone VARCHAR(20),
    resp_celular VARCHAR(20) NOT NULL
);

CREATE TABLE Alunos (
    alu_codigo SERIAL PRIMARY KEY,
    alu_nome VARCHAR(255) NOT NULL,
    alu_rg VARCHAR(20) NOT NULL UNIQUE,
    alu_observacoes VARCHAR(255),
    alu_datanasc DATE NOT NULL,
    alu_celular VARCHAR(16)
);

CREATE TABLE Parentescos (
    alu_codigo INT NOT NULL,
    resp_codigo INT NOT NULL,
    par_parentesco VARCHAR(45) NOT NULL,
    CONSTRAINT pk_parentesco PRIMARY KEY (alu_codigo, resp_codigo),
    CONSTRAINT fk_aluparentesco FOREIGN KEY (alu_codigo) REFERENCES Alunos(alu_codigo) ON DELETE CASCADE,
    CONSTRAINT fk_respparentesco FOREIGN KEY (resp_codigo) REFERENCES Responsaveis(resp_codigo) ON DELETE CASCADE
);

CREATE TABLE pontosdeembarque (
  pde_codigo SERIAL PRIMARY KEY,
  pde_rua VARCHAR(45) NOT NULL,
  pde_bairro VARCHAR(45) NOT NULL,
  pde_numero VARCHAR(45) NOT NULL,
  pde_cep VARCHAR(45) NOT NULL
);

CREATE TABLE Escolas (
  esc_codigo SERIAL PRIMARY KEY,
  esc_nome VARCHAR(45) NOT NULL,
  esc_tipo CHAR NOT NULL,
  esc_email VARCHAR(45) NOT NULL,
  esc_telefone VARCHAR(45) NOT NULL,
  pde_codigo INT NOT NULL,
  CONSTRAINT fk_escolas_pontosdeembarque FOREIGN KEY (pde_codigo) REFERENCES pontosdeembarque(pde_codigo)
);

CREATE TABLE Motoristas (
  moto_id SERIAL PRIMARY KEY,
  moto_cnh VARCHAR(45) NOT NULL UNIQUE,
  moto_celular VARCHAR(16) NOT NULL,
  moto_nome VARCHAR(45) NOT NULL
);

CREATE TABLE Monitores (
  mon_codigo SERIAL PRIMARY KEY,
  mon_nome VARCHAR(45) NOT NULL,
  mon_cpf VARCHAR(14) NOT NULL UNIQUE,
  mon_celular VARCHAR(16) NOT NULL
);

CREATE TABLE Rotas (
  rot_codigo SERIAL PRIMARY KEY,
  rot_nome VARCHAR(45) NOT NULL,
  rot_km INT NOT NULL,
  rot_periodo CHAR NOT NULL,
  rot_tempoInicio VARCHAR(45) NOT NULL,
  rot_tempoFinal VARCHAR(45) NOT NULL,
  vei_codigo INT NOT NULL,
  mon_codigo INT NOT NULL,
  CONSTRAINT fk_rotas_veiculos FOREIGN KEY (vei_codigo) REFERENCES Veiculos(vei_codigo),
  CONSTRAINT fk_rotas_monitores FOREIGN KEY (mon_codigo) REFERENCES Monitores(mon_codigo)
);

CREATE TABLE Inscricoes (
  insc_ano INT NOT NULL,
  insc_anoLetivo VARCHAR(2) NOT NULL,
  insc_turma CHAR NOT NULL,
  insc_etapa CHAR NOT NULL,
  insc_periodo CHAR NOT NULL,
  insc_dataAlocacao DATE,
  insc_rua varchar(45),
  insc_cep varchar(45),
  insc_numero varchar(45),
  insc_bairro varchar(45),
  alu_codigo INT NOT NULL,
  esc_codigo INT NOT NULL,
  pde_codigo INT NOT NULL,
  rot_codigo INT,
  PRIMARY KEY (insc_ano, alu_codigo),
  CONSTRAINT fk_inscricoes_alunos FOREIGN KEY (alu_codigo) REFERENCES Alunos(alu_codigo),
  CONSTRAINT fk_inscricoes_escolas FOREIGN KEY (esc_codigo) REFERENCES Escolas(esc_codigo),
  CONSTRAINT fk_inscricoes_pontosdeembarque FOREIGN KEY (pde_codigo) REFERENCES pontosdeembarque(pde_codigo),
  CONSTRAINT fk_inscricoes_rotas FOREIGN KEY (rot_codigo) REFERENCES Rotas(rot_codigo)
);

CREATE TABLE Manutencoes (
  manu_codigo SERIAL PRIMARY KEY,
  manu_tipo CHAR NOT NULL,
  manu_data DATE NOT NULL,
  vei_codigo INT,
  CONSTRAINT fk_manutencoes_veiculos FOREIGN KEY (vei_codigo) REFERENCES Veiculos(vei_codigo)
);

CREATE TABLE Rotas_tem_PontosdeEmbarque (
  rot_codigo INT NOT NULL,
  pde_codigo INT NOT NULL,
  ordem CHAR NOT NULL,
  PRIMARY KEY (rot_codigo, pde_codigo),
  CONSTRAINT fk_rotas_tem_pontosdeembarque_rotas FOREIGN KEY (rot_codigo) REFERENCES Rotas(rot_codigo),
  CONSTRAINT fk_rotas_tem_pontosdeembarque_pontosdeembarque FOREIGN KEY (pde_codigo) REFERENCES PontosdeEmbarque(pde_codigo)
);

CREATE TABLE Rotas_tem_Motoristas (
  moto_id INT NOT NULL,
  rot_codigo INT NOT NULL,
  PRIMARY KEY (moto_id, rot_codigo),
  CONSTRAINT fk_rotas_tem_motoristas_rotas FOREIGN KEY (rot_codigo) REFERENCES Rotas(rot_codigo),
  CONSTRAINT fk_rotas_tem_motoristas_motoristas FOREIGN KEY (moto_id) REFERENCES Motoristas(moto_id)
);

-- Inserts para a tabela Usuarios
INSERT INTO Usuarios (user_nome, user_senha, user_cpf, user_email, user_celular)
VALUES ('admin', 'senha123', '123.456.789-00', 'usuario1@email.com', '(12) 93456-7890'),
       ('usuario2', 'senha456', '987.654.321-00', 'usuario2@email.com', '(98) 97654-3210'),
       ('usuario3', 'senha789', '111.222.333-44', 'usuario3@email.com', '(11) 91222-3333');

-- Inserts para a tabela Veiculos
INSERT INTO Veiculos (vei_renavam, vei_placa, vei_modelo, vei_capacidade, vei_tipo)
VALUES ('12345678901', 'ABC123', 'Ônibus', 5, 'C'),
       ('98765432109', 'XYZ789', 'Micro', 7, 'V'),
       ('11122233344', 'DEF456', 'Micro', 9, 'C'),
       ('99726698546', 'GHI789', 'Ônibus', 9, 'C');

-- Inserts para a tabela Responsaveis
INSERT INTO Responsaveis (resp_nome, resp_rg, resp_cpf, resp_email, resp_telefone, resp_celular)
VALUES ('Responsavel 1', '1234567-8', '123.456.789-00', 'responsavel1@email.com', '(21) 2345-6789', '(22) 93456-7890'),
       ('Responsavel 2', '9876543-2', '987.654.321-00', 'responsavel2@email.com', '(33) 4567-8901', '(44) 95678-9012'),
       ('Responsavel 3', '1112223-4', '111.222.333-44', 'responsavel3@email.com', '(55) 6789-0123', '(66) 97890-1234');

-- Inserts para a tabela Alunos
INSERT INTO Alunos (alu_nome, alu_rg, alu_observacoes, alu_datanasc, alu_celular)
VALUES ('Aluno 1', '1234567-8', 'Observacoes sobre Aluno 1', '2005-01-01', '(77) 98901-2345'),
       ('Aluno 2', '9876543-2', 'Observacoes sobre Aluno 2', '2006-02-02', '(88) 99012-3456'),
       ('Aluno 3', '1112223-4', 'Observacoes sobre Aluno 3', '2007-03-03', '(99) 90123-4567');

-- Inserts para a tabela Parentescos
INSERT INTO Parentescos (alu_codigo, resp_codigo, par_parentesco)
VALUES (1, 1, 'Pai'),
       (2, 2, 'Mãe'),
       (3, 3, 'Tio');

-- Inserts para a tabela PontosdeEmbarque
INSERT INTO PontosdeEmbarque (pde_rua, pde_bairro, pde_numero, pde_cep)
VALUES ('R. Guarucaia','Jardim Bela Vista','649', '19160-000'),
       ('R. Alfredo Marcondes','Álvares Machado','113', '19160-000'),
       ('José alexandre','Jardim Antonio Pichione', '72', '19160-000'),
       ('R. Geraldo Cândido Martins','Álvares Machado','220','19160-000'),
       ('R. Almeida Cardoso','Álvares Machado','135','19160-000'),
       ('R. Iansã','Álvares Machado','22','19160-000');

-- Inserts para a tabela Escolas
INSERT INTO Escolas (esc_nome, esc_tipo, esc_email, esc_telefone, pde_codigo)
VALUES ('Escola 1', 'P', 'escola1@email.com', '(123) 456-7890', 1),
       ('Escola 2', 'E', 'escola2@email.com', '(987) 654-3210', 2),
       ('Escola 3', 'P', 'escola3@email.com', '(111) 222-3333', 3);

-- Inserts para a tabela Motoristas
INSERT INTO Motoristas (moto_cnh, moto_celular, moto_nome)
VALUES ('12345678901', '(123) 456-7890', 'Motorista 1'),
       ('98765432109', '(987) 654-3210', 'Motorista 2'),
       ('11122233344', '(111) 222-3333', 'Motorista 3');

-- Inserts para a tabela Monitores
INSERT INTO Monitores (mon_nome, mon_cpf, mon_celular)
VALUES ('Valdemar', '123.456.789-00', '(123) 456-7890'),
       ('Antonio', '987.654.321-00', '(987) 654-3210'),
       ('Joao', '111.222.333-44', '(111) 222-3333'),
       ('Maria', '111.222.333-55', '(111) 222-4444');

-- Inserts para a tabela Rotas
INSERT INTO Rotas (rot_nome, rot_km, rot_periodo, rot_tempoInicio, rot_tempoFinal, vei_codigo, mon_codigo)
VALUES ('Rota 1', 10, 'M', '08:00', '10:00', 1, 1),
       ('Rota 2', 15, 'T', '13:00', '15:00', 2, 2),
       ('Rota 3', 20, 'N', '18:00', '20:00', 3, 3);

-- Inserts para a tabela Inscricoes
INSERT INTO Inscricoes (insc_ano, insc_anoLetivo, insc_turma, insc_etapa, insc_periodo, insc_dataAlocacao, insc_rua, insc_cep, insc_numero, insc_bairro, alu_codigo, esc_codigo, pde_codigo, rot_codigo)
VALUES
  (2024, '24', 'A', '1', '1', '2024-04-23', 'Rua A', '12345-678', '123', 'Bairro A', 1, 1, 1, 1),
  (2024, '24', 'B', '2', '1', '2024-04-23', 'Rua B', '23456-789', '234', 'Bairro B', 2, 2, 2, 2),
  (2024, '24', 'C', '3', '1', '2024-04-23', 'Rua C', '34567-890', '345', 'Bairro C', 3, 3, 3, 3);

-- Inserts para a tabela Manutencoes
INSERT INTO Manutencoes (manu_tipo, manu_data, vei_codigo)
VALUES ('P', '2024-04-22', 1),
       ('C', '2024-04-22', 2),
       ('P', '2024-04-22', 3);

-- Inserts para a tabela Rotas_tem_PontosdeEmbarque
INSERT INTO Rotas_tem_PontosdeEmbarque (rot_codigo,pde_codigo,ordem)
VALUES (1,1,1),
       (2,2,1),
       (3,3,1);

-- Inserts para a tabela Rotas_tem_Motoristas
INSERT INTO Rotas_tem_Motoristas (moto_id, rot_codigo)
VALUES (1, 1),
       (2, 2),
       (3, 3);
