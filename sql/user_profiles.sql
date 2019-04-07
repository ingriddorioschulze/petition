DROP TABLE IF EXISTS signatures;

CREATE TABLE  user_profiles (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users (id),
    age VARCHAR(250),
    city VARCHAR(250),
    url VARCHAR(250)

);