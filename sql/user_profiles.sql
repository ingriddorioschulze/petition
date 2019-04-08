DROP TABLE IF EXISTS signatures;

CREATE TABLE  user_profiles (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users (id),
    age VARCHAR(250),
    city VARCHAR(250),
    url VARCHAR(250)

);

ALTER TABLE user_profiles ADD CONSTRAINT user_id_unique 
UNIQUE (user_id);

ALTER TABLE user_profiles ALTER COLUMN user_id SET NOT NULL;