CREATE TABLE Usuarios (
    user_nome VARCHAR(100) NOT NULL UNIQUE,
    user_senha VARCHAR(255) NOT NULL,
    user_cpf VARCHAR(14) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_celular VARCHAR(20) NOT NULL,
    user_nivel VARCHAR(13) NOT NULL,
    CONSTRAINT pk_usuarios PRIMARY KEY (user_cpf)
);

CREATE TABLE RedefinicoesSenha (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    codigo VARCHAR(6) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES Usuarios(user_email) ON DELETE CASCADE
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
    alu_celular VARCHAR(16),
    alu_status CHAR DEFAULT 'A',
    alu_motivoInativo VARCHAR(255)
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
  pde_rua VARCHAR(255) NOT NULL,
  pde_bairro VARCHAR(255) NOT NULL,
  pde_numero VARCHAR(45) NOT NULL,
  pde_cep VARCHAR(45) NOT NULL
);

CREATE TABLE Escolas (
  esc_codigo SERIAL PRIMARY KEY,
  esc_nome VARCHAR(255) NOT NULL,
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
  moto_nome VARCHAR(255) NOT NULL
);

CREATE TABLE Monitores (
  mon_codigo SERIAL PRIMARY KEY,
  mon_nome VARCHAR(255) NOT NULL,
  mon_cpf VARCHAR(14) NOT NULL UNIQUE,
  mon_celular VARCHAR(16) NOT NULL
);

CREATE TABLE Veiculos (
  vei_codigo SERIAL PRIMARY KEY,
  vei_renavam VARCHAR(11) NOT NULL UNIQUE,
  vei_placa VARCHAR(7) NOT NULL UNIQUE,
  vei_modelo VARCHAR(45) NOT NULL,
  vei_capacidade INT NOT NULL,
  vei_tipo CHAR NOT NULL
);

CREATE TABLE Manutencoes (
  manu_codigo SERIAL PRIMARY KEY,
  manu_tipo VARCHAR(11) NOT NULL,
  manu_data DATE NOT NULL,
  manu_observacoes VARCHAR(255),
  manu_valor NUMERIC(6,2),
  vei_codigo INT NOT NULL,
  CONSTRAINT fk_manutencoes_veiculos FOREIGN KEY (vei_codigo) REFERENCES Veiculos(vei_codigo)
);

CREATE TABLE PeriodoManutencao (
    pm_id SERIAL PRIMARY KEY,
    vei_codigo INT NOT NULL,
    pm_data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vei_codigo) REFERENCES Veiculos(vei_codigo) ON DELETE CASCADE
);

CREATE TABLE Rotas (
  rot_codigo SERIAL PRIMARY KEY,
  rot_nome VARCHAR(255) NOT NULL,
  rot_km INT NOT NULL,
  rot_periodo CHAR NOT NULL,
  rot_tempoInicio VARCHAR(45) NOT NULL,
  rot_tempoFinal VARCHAR(45) NOT NULL,
  vei_codigo INT NOT NULL,
  mon_codigo INT NOT NULL,
  status BOOLEAN,
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
  insc_rua varchar(255),
  insc_cep varchar(45),
  insc_numero varchar(45),
  insc_bairro varchar(255),
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

CREATE TABLE Contas (
    con_id SERIAL PRIMARY KEY,
    con_valor DECIMAL(10, 2) NOT NULL,
    con_descricao VARCHAR(255) NOT NULL,
    con_data_vencimento DATE,
    con_data_recebimento DATE,
    con_status VARCHAR(50) NOT NULL,
    con_categoria VARCHAR(50),
    con_data_criacao DATE CURRENT_DATE,
    con_observacoes VARCHAR(255)
);

-- Inserts para a tabela Usuarios
INSERT INTO Usuarios (user_nome, user_senha, user_cpf, user_email, user_celular, user_nivel)
VALUES ('admin', 'senha123', '868.946.030-65', 'usuario1@email.com', '(12) 93456-7890', 'administrador'),
       ('usuario2', 'senha456', '157.849.320-04', 'usuario2@email.com', '(98) 97654-3210', 'normal'),
       ('usuario3', 'senha789', '714.378.720-50', 'usuario3@email.com', '(11) 91222-3333', 'normal');

-- Inserts para a tabela Veiculos
INSERT INTO Veiculos (vei_renavam, vei_placa, vei_modelo, vei_capacidade, vei_tipo)
VALUES ('12345678901', 'ABC123', 'Ônibus', 5, 'C'),
       ('98765432109', 'XYZ789', 'Micro', 7, 'V'),
       ('11122233344', 'DEF456', 'Micro', 9, 'C'),
       ('99726698546', 'GHI789', 'Ônibus', 9, 'C');

-- Inserts para a tabela Responsaveis
INSERT INTO Responsaveis (resp_nome, resp_rg, resp_cpf, resp_email, resp_telefone, resp_celular)
VALUES ('Laura Gomes Santos', '1234567-8', '123.456.789-00', 'responsavel1@email.com', '(21) 2345-6789', '(22) 93456-7890'),
       ('Vitor Martins Costa', '9876543-2', '987.654.321-00', 'responsavel2@email.com', '(33) 4567-8901', '(44) 95678-9012'),
       ('Breno Lima Cunha', '1112223-4', '111.222.333-44', 'responsavel3@email.com', '(55) 6789-0123', '(66) 97890-1234'),
       ('Brenda Ribeiro Sousa', '1112223-5', '111.222.333-55', 'email@email', '(55) 6789-0123', '(66) 97890-1234');

-- Inserts para a tabela Alunos
INSERT INTO Alunos (alu_nome, alu_rg, alu_observacoes, alu_datanasc, alu_celular)
VALUES ('Anna Silva Sousa', '1234567-8', 'Observacoes sobre Aluno 1', '2005-01-01', '(77) 98901-2345'),
       ('Estevan Almeida Rodrigues', '9876543-2', 'Observacoes sobre Aluno 2', '2006-02-02', '(88) 99012-3456'),
       ('Daniel Barros Barbosa', '1112223-4', 'Observacoes sobre Aluno 3', '2007-03-03', '(99) 90123-4567'),
       ('Caio Costa Dias', '1112223-5', 'Observacoes sobre Aluno 4', '2008-04-04', '(00) 01234-5678'),
        ('Martim Lima Martins', '1112223-6', 'Observacoes sobre Aluno 5', '2009-05-05', '(11) 12345-6789'),
        ('Luís Correia Cavalcanti', '1112223-7', 'Observacoes sobre Aluno 6', '2010-06-06', '(22) 23456-7890'),
        ('Thiago Ribeiro Azevedo', '1112223-8', 'Observacoes sobre Aluno 7', '2011-07-07', '(33) 34567-8901'),
        ('Rafaela Costa Dias', '1112223-9', 'Observacoes sobre Aluno 8', '2012-08-08', '(44) 45678-9012'),
        ('Lucas Silva Cunha', '1112223-0', 'Observacoes sobre Aluno 9', '2013-09-09', '(55) 56789-0123'),
        ('Breno Dias Pinto', '1112223-1', 'Observacoes sobre Aluno 10', '2014-10-10', '(66) 67890-1234');


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
       ('R. Geraldo Cândido Martins','Centro','220','19160-000'),
       ('R. Almeida Cardoso','Limoeiro','135','19160-000'),
       ('R. Iansã','Parque dos Pinheiros','22','19160-000');

-- Inserts para a tabela Escolas
INSERT INTO Escolas (esc_nome, esc_tipo, esc_email, esc_telefone, pde_codigo)
VALUES ('EMEIF Álvares Machado', 'A', 'escola1@email.com', '(123) 456-7890', 1),
       ('E.E. Angelica De Oliveira', 'I', 'escola2@email.com', '(987) 654-3210', 2),
       ('EMEIF Governador Mário Covas', 'F', 'escola3@email.com', '(111) 222-3333', 3);

-- Inserts para a tabela Motoristas
INSERT INTO Motoristas (moto_cnh, moto_celular, moto_nome)
VALUES ('12345678901', '(123) 456-7890', 'Thaís Rodrigues Oliveira'),
       ('98765432109', '(987) 654-3210', 'Júlia Rocha Barbosa'),
       ('11122233344', '(111) 222-3333', 'Tomás Goncalves Alves');

-- Inserts para a tabela Monitores
INSERT INTO Monitores (mon_nome, mon_cpf, mon_celular)
VALUES ('Clara Cunha Ribeiro', '123.456.789-00', '(123) 456-7890'),
       ('Giovana Almeida Dias', '987.654.321-00', '(987) 654-3210'),
       ('Melissa Azevedo Carvalho', '111.222.333-44', '(111) 222-3333'),
       ('Aline Cunha Rodrigues', '111.222.333-55', '(111) 222-4444');

-- Inserts para a tabela Rotas
INSERT INTO Rotas (rot_nome, rot_km, rot_periodo, rot_tempoInicio, rot_tempoFinal, vei_codigo, mon_codigo,status)
VALUES ('Chácara Matsuda/Bairro Balneário/Residencial União', 10, 'M', '08:00', '10:00', 1, 1,true),
       ('1º de Maio/São Geraldo/Parque dos Pinheiros', 15, 'T', '13:00', '15:00', 2, 2,true),
       ('Limoeiro/Cobral/Cond. Gramado', 20, 'N', '18:00', '20:00', 3, 3,true);

-- Inserts para a tabela Inscricoes
INSERT INTO Inscricoes (insc_ano, insc_anoLetivo, insc_turma, insc_etapa, insc_periodo, insc_dataAlocacao, insc_rua, insc_cep, insc_numero, insc_bairro, alu_codigo, esc_codigo, pde_codigo, rot_codigo)
VALUES
  (2024, '1I', 'A', 'I', 'I', '2024-04-23', 'Rua Rui Barbosa', '12345-678', '123', 'Campo Alto', 1, 1, 6, 1),
  (2024, '2', 'B', 'F', 'M', '2024-04-23', 'Rua Manuel Fagundes de Lima', '23456-789', '234', 'Felicidade Avista', 2, 2, 4, 2),
  (2024, '1I', 'A', 'I', 'I', null, 'Rua Rui Barbosa', '12345-678', '123', 'Campo Alto', 4, 3, 2, null),
  (2024, '2', 'B', 'F', 'M', null, 'Rua Manuel Fagundes de Lima', '23456-789', '234', 'Felicidade Avista', 5, 2, 5, null),
  (2024, '3', 'C', 'F', 'V', null, 'Rua São José', '34567-890', '345', 'Riacho Lua Doce', 6, 1, 6, null),
  (2024, '4', 'C', 'F', 'M', '2024-04-23', 'Rua São José', '34567-890', '345', 'Riacho Lua Doce', 3, 3, 4, 3);

-- Inserts para a tabela Manutencoes
INSERT INTO Manutencoes (manu_tipo, manu_data, manu_observacoes, manu_valor, vei_codigo)
VALUES ('preventiva', '2024-04-22', '', 5000, 1),
       ('corretiva', '2024-04-22', 'Trocar o escapamento.', 7650, 2),
       ('preventiva', '2024-04-22', '', 5000, 3);

--InsertS para a tabela PeriodoManutencao
INSERT INTO PeriodoManutencao (vei_codigo, pm_data_criacao)
VALUES (1, '2024-04-22'),
       (3, '2024-04-22');

-- Inserts para a tabela Rotas_tem_PontosdeEmbarque
INSERT INTO Rotas_tem_PontosdeEmbarque (rot_codigo,pde_codigo,ordem)
VALUES (1,1,3),
       (1,4,1),
       (1,5,2),
       (2,2,3),
       (2,5,1),
       (2,6,2),
       (3,2,1),
       (3,3,2);

-- Inserts para a tabela Rotas_tem_Motoristas
INSERT INTO Rotas_tem_Motoristas (moto_id, rot_codigo)
VALUES (1, 1),
       (2, 2),
       (3, 3);
