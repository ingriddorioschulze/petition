DROP TABLE IF EXISTS signatures;

CREATE TABLE  users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    email_address VARCHAR(250) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL
);

ALTER TABLE users ADD COLUMN time TIMESTAMPTZ; 

ALTER TABLE users ADD CONSTRAINT email_unique UNIQUE (email_address);