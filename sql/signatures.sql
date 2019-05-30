DROP TABLE IF EXISTS signatures;

CREATE TABLE  signatures (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    time TIMESTAMPTZ,
    user_id BIGINT NOT NULL REFERENCES users (id)
);

