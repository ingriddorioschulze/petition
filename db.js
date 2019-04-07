const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// exports.addCity = function addCity(city, country, description) {
//     let q = "INSERT INTO cities (city) VALUES ($1, $2, $3)";

exports.signatures = function signatures(user, signature, time) {
    const q = `INSERT INTO signatures (first_name, last_name, signature, time, user_id) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [user.firstName, user.lastName, signature, time, user.id];
    return db.query(q, params).then(result => {
        return result.rows[0].id;
    });
};

exports.getSignatures = () => {
    const q = `SELECT first_name, last_name, age, city, url 
    FROM signatures
    JOIN user_profiles ON signatures.user_id = user_profiles.user_id
    JOIN users ON users.id = signatures.user_id`;
    return db.query(q).then(result => {
        return result.rows;
    });
};

exports.getSignaturesCity = city => {
    const q = `SELECT first_name, last_name, age, city, url
    FROM signatures
    JOIN user_profiles ON signatures.user_id = user_profiles.user_id
    JOIN users ON users.id = signatures.user_id
    WHERE city = $1`;
    const params = [city];
    return db.query(q, params).then(result => {
        return result.rows;
    });
};

exports.getImageSignature = id => {
    const q = `SELECT signature FROM signatures WHERE id = ${id}`;
    return db.query(q).then(result => {
        return result.rows[0].signature;
    });
};

//REGISTER//

exports.saveUser = function saveUser(
    first_name,
    last_name,
    email_address,
    password,
    time
) {
    const q = `INSERT INTO users (first_name, last_name, email_address, password, time) 
    VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [first_name, last_name, email_address, password, time];
    return db.query(q, params).then(result => {
        return result.rows[0].id;
    });
};

exports.getUser = function(email_address) {
    const q = `SELECT users.id AS user_id, users.first_name, users.last_name, password, signatures.id AS signature_id, user_profiles.id AS profile_id
    FROM users 
    LEFT JOIN signatures ON users.id = signatures.user_id
    LEFT JOIN user_profiles ON users.id = user_profiles.user_id
    WHERE email_address = $1`;
    const params = [email_address];
    return db.query(q, params).then(result => {
        if (result.rows.length === 0) {
            return null;
        } else {
            return result.rows[0];
        }
    });
};

exports.saveProfile = function(user_id, age, city, url) {
    const q = `INSERT INTO user_profiles (user_id, age, city, url) 
    VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [user_id, age, city, url];
    return db.query(q, params).then(result => {
        return result.rows[0];
    });
};
