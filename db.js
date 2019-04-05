const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// exports.addCity = function addCity(city, country, description) {
//     let q = "INSERT INTO cities (city) VALUES ($1, $2, $3)";

exports.signatures = function signatures(user, signature, time) {
    const q = `INSERT INTO signatures (first_name, last_name, signature, time, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [user.firstName, user.lastName, signature, time, user.id];
    return db.query(q, params).then(result => {
        return result.rows[0].id;
    });
};

exports.getSignatures = () => {
    const q = `SELECT first_name, last_name FROM signatures`;
    return db.query(q).then(result => {
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
    const q = `INSERT INTO users (first_name, last_name, email_address, password, time) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [first_name, last_name, email_address, password, time];
    return db.query(q, params).then(result => {
        return result.rows[0].id;
    });
};

exports.getUser = function(email_address) {
    const q = `SELECT id, first_name, last_name, password FROM users WHERE email_address = $1`;
    const params = [email_address];
    return db.query(q, params).then(result => {
        if (result.rows.length === 0) {
            return null;
        } else {
            return result.rows[0];
        }
    });
};
