DROP TABLE IF EXISTS signatures;

CREATE TABLE  signatures (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    time TIMESTAMPTZ,
    user_id BIGINT NOT NULL REFERENCES users (id)
);

ALTER TABLE signatures ADD COLUMN user_id BIGINT REFERENCES users (id); 
ALTER TABLE signatures DROP COLUMN first_name;
ALTER TABLE signatures DROP COLUMN last_name;
