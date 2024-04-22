CREATE TABLE Usuarios (
    user_nome VARCHAR(100) NOT NULL PRIMARY KEY,
    user_senha VARCHAR(255) NOT NULL,
    user_cpf VARCHAR(14) NOT NULL UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    user_celular VARCHAR(20) NOT NULL
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

CREATE TABLE PontosdeEmbarque (
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
  CONSTRAINT fk_escolas_pontosdeembarque FOREIGN KEY (pde_codigo) REFERENCES PontosdeEmbarque(pde_codigo)
);

CREATE TABLE Motoristas (
  mot_codigo SERIAL PRIMARY KEY,
  mot_cnh VARCHAR(45) NOT NULL UNIQUE,
  mot_celular VARCHAR(16) NOT NULL,
  mot_nome VARCHAR(45) NOT NULL
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
  insc_codigo SERIAL,
  insc_ano INT NOT NULL,
  insc_anoLetivo VARCHAR(2) NOT NULL,
  insc_turma CHAR NOT NULL,
  insc_etapa CHAR NOT NULL,
  insc_periodo CHAR NOT NULL,
  insc_dataAlocacao DATE,
  insc_rua VARCHAR(45) NOT NULL,
  insc_cep VARCHAR(45) NOT NULL,
  insc_numero VARCHAR(45) NOT NULL,
  insc_bairro VARCHAR(45) NOT NULL,
  alu_codigo INT NOT NULL,
  esc_codigo INT NOT NULL,
  pde_codigo INT NOT NULL,
  rot_codigo INT,
  PRIMARY KEY (insc_codigo, alu_codigo),
  CONSTRAINT fk_inscricoes_alunos FOREIGN KEY (alu_codigo) REFERENCES Alunos(alu_codigo),
  CONSTRAINT fk_inscricoes_escolas FOREIGN KEY (esc_codigo) REFERENCES Escolas(esc_codigo),
  CONSTRAINT fk_inscricoes_pontosdeembarque FOREIGN KEY (pde_codigo) REFERENCES PontosdeEmbarque(pde_codigo),
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
  PRIMARY KEY (rot_codigo, pde_codigo),
  CONSTRAINT fk_rotas_tem_pontosdeembarque_rotas FOREIGN KEY (rot_codigo) REFERENCES Rotas(rot_codigo),
  CONSTRAINT fk_rotas_tem_pontosdeembarque_pontosdeembarque FOREIGN KEY (pde_codigo) REFERENCES PontosdeEmbarque(pde_codigo)
);

CREATE TABLE Rotas_tem_Motoristas (
  mot_codigo INT NOT NULL,
  rot_codigo INT NOT NULL,
  PRIMARY KEY (mot_codigo, rot_codigo),
  CONSTRAINT fk_rotas_tem_motoristas_rotas FOREIGN KEY (rot_codigo) REFERENCES Rotas(rot_codigo),
  CONSTRAINT fk_rotas_tem_motoristas_motoristas FOREIGN KEY (mot_codigo) REFERENCES Motoristas(mot_codigo)
);