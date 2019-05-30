DROP TABLE IF EXISTS signatures;

CREATE TABLE  user_profiles (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users (id),
    age VARCHAR(250),
    city VARCHAR(250),
    url VARCHAR(250)

);
