CREATE TABLE accounts (
  email varchar(255) NOT NULL UNIQUE,
  password varchar(64) NOT NULL,
  salt varchar(32) NOT NULL,
  rfid varchar(8) NOT NULL UNIQUE
);
