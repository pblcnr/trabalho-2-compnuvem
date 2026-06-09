USE `aula-db`;

CREATE TABLE cliente (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(80)  NOT NULL,
  email      VARCHAR(120) NOT NULL UNIQUE,
  criado_em  DATETIME     DEFAULT NOW(),
  criado_por VARCHAR(30)  NOT NULL
);

CREATE TABLE produto (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  descricao  VARCHAR(80) NOT NULL,
  categoria  VARCHAR(30) NOT NULL,
  valor      NUMERIC(15,2) NOT NULL,
  estoque    INT           NOT NULL,
  criado_em  DATETIME      DEFAULT NOW(),
  criado_por VARCHAR(30)   NOT NULL
);

CREATE TABLE pedido (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id   INT           NOT NULL,
  valor_total  NUMERIC(15,2) NOT NULL,
  status       VARCHAR(20)   NOT NULL,
  criado_em    DATETIME      DEFAULT NOW(),
  criado_por   VARCHAR(30)   NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

CREATE TABLE pedido_item (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id      INT           NOT NULL,
  produto_id     INT           NOT NULL,
  quantidade     INT           NOT NULL,
  valor_unitario NUMERIC(15,2) NOT NULL,
  FOREIGN KEY (pedido_id)  REFERENCES pedido(id),
  FOREIGN KEY (produto_id) REFERENCES produto(id)
);
