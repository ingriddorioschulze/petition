DROP TABLE IF EXISTS signatures;

CREATE TABLE  signatures (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    signature TEXT NOT NULL,
    time TIMESTAMPTZ
);

-- run in the terminal
-- psql petition -f sql/signatures.sql