const express = require("express");
const hb = require("express-handlebars");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const bcrypt = require("bcryptjs");

const app = express();

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

app.use(
    cookieSession({
        maxAge: 1000 * 60 * 60 * 24 * 24,
        secret: `dumplingspopcornpandas`
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.set("x-frame-option", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.engine("handlebars", hb({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("./public"));

function checkSigned(request, response, next) {
    if (request.session.user.signatureId !== null) {
        response.redirect("/petition/signed");
    } else {
        next();
    }
}

app.use("/petition", (req, res, next) => {
    if (req.session.user !== undefined) {
        next();
    } else {
        res.redirect("/register");
    }
});

app.get("/petition", checkSigned, (req, res) => {
    res.render("home", {});
});

app.post("/petition", checkSigned, (req, res) => {
    db.signatures(req.session.user, req.body.Signature, new Date())
        .then(id => {
            req.session.user.signatureId = id;
            res.redirect("/petition/signed");
        })
        .catch(err => {
            console.log("err in signatures", err);
            res.render("home", {
                error: true
            });
        });
});

app.get("/petition/signed", (req, res) => {
    if (req.session.user.signatureId) {
        db.getImageSignature(req.session.user.signatureId).then(
            imageSignature => {
                res.render("thanks", {
                    firstName: req.session.user.firstName,
                    lastName: req.session.user.lastName,
                    imageSignature: imageSignature
                });
            }
        );
    } else {
        res.redirect("/petition");
    }
});

app.get("/petition/signers", (req, res) => {
    db.getSignatures().then(signatures => {
        res.render("signers", {
            signatures: signatures
        });
    });
});

// ROUTE register //
//ToDo: handle errors from query parameter//
app.get("/register", (req, res) => {
    res.render("register", {});
});

app.post("/register", (req, res) => {
    hashPassword(req.body.Password)
        .then(hashedPassword => {
            return db.saveUser(
                req.body.FirstName,
                req.body.LastName,
                req.body.Email,
                hashedPassword,
                new Date()
            );
        })
        .then(userId => {
            req.session.user = {
                id: userId,
                firstName: req.body.FirstName,
                lastName: req.body.LastName,
                signatureId: null
            };
            res.redirect("/profile");
        })
        .catch(() => {
            res.redirect("/register?error=email");
        });
});

// ROUTE Login//

app.get("/login", (req, res) => {
    res.render("login", {});
});

app.post("/login", (req, res) => {
    db.getUser(req.body.Email).then(user => {
        if (user == null) {
            return res.redirect("/login?error=usernotfound");
        }
        checkPassword(req.body.Password, user.password).then(doesMatch => {
            if (doesMatch == true) {
                req.session.user = {
                    id: user.user_id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    signatureId: user.signature_id
                };
                if (user.signature_id == null) {
                    res.redirect("/petition");
                } else {
                    res.redirect("/petition/signed");
                }
            } else {
                res.redirect("/login?error=wrongpassword");
            }
        });
    });
});

//BCRYPT//

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
}

//ROUTE LOGOUT//

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

//ROUTE PROFILE//

app.get("/profile", (req, res) => {
    res.render("profile", {});
});

app.listen(8080, () => console.log("Oi, petition!"));
