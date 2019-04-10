const spicedPg = require("spiced-pg");

const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/petition";

const db = spicedPg(dbUrl);

exports.signatures = function signatures(user, signature, time) {
    const q = `INSERT INTO signatures (signature, time, user_id) 
    VALUES ($1, $2, $3) RETURNING id`;
    const params = [signature, time, user.id];
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
    const q = `SELECT signature FROM signatures WHERE id = $1`;
    const params = [id];
    return db.query(q, params).then(result => {
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

exports.getEditProfile = function(user_id) {
    const q = `SELECT first_name, last_name, email_address, age, city, url FROM users
    LEFT JOIN user_profiles ON users.id = user_profiles.user_id
    WHERE users.id = $1`;
    const params = [user_id];
    return db.query(q, params).then(result => {
        return result.rows[0];
    });
};

exports.updateProfile = function(
    user_id,
    first_name,
    last_name,
    email_address,
    password,
    age,
    city,
    url
) {
    let userQuery;
    let userParams;

    if (password) {
        userQuery = `UPDATE users 
        SET first_name = $1, last_name = $2, password = $3, email_address = $4
        WHERE id = $5`;
        userParams = [first_name, last_name, password, email_address, user_id];
    } else {
        userQuery = `UPDATE users 
        SET first_name = $1, last_name = $2, email_address = $3
        WHERE id = $4`;
        userParams = [first_name, last_name, email_address, user_id];
    }
    return db.query(userQuery, userParams).then(() => {
        const profileQuery = `INSERT INTO user_profiles (user_id, age, city, url)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $2, city = $3, url = $4`;

        const profileParams = [user_id, age, city, url];
        return db.query(profileQuery, profileParams);
    });
};

//DELETE SIGNATURE//

exports.deleteSignature = function(user_id) {
    const q = `DELETE FROM signatures WHERE user_id = $1`;
    const params = [user_id];
    return db.query(q, params);
};
