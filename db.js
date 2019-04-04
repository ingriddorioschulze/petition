const spicedPg = require("spiced-pg");

const db = spicedPg("postgres:postgres:postgres@localhost:5432/petition");

// exports.addCity = function addCity(city, country, description) {
//     let q = "INSERT INTO cities (city) VALUES ($1, $2, $3)";

exports.signatures = function signatures(
    first_name,
    last_name,
    signature,
    time
) {
    let q = `INSERT INTO signatures (first_name, last_name, signature, time) VALUES ($1, $2, $3, $4) RETURNING id`;
    let params = [first_name, last_name, signature, time];
    return db.query(q, params).then(result => {
        return result.rows[0].id;
    });
};

exports.getSignatures = () => {
    let q = `SELECT first_name, last_name FROM signatures`;
    return db.query(q).then(result => {
        return result.rows;
    });
};

exports.getImageSignature = id => {
    let q = `SELECT signature FROM signatures WHERE id = ${id}`;
    return db.query(q).then(result => {
        return result.rows[0].signature;
    });
};
