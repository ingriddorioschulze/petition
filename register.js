const express = require("express");
const db = require("./db");
const password = require("./password");

const router = express.Router();

router
    .route("/register")
    .get((req, res) => {
        if (req.session.user !== undefined) {
            res.redirect("/petition");
        } else {
            res.render("register", {});
        }
    })
    .post((req, res) => {
        password
            .hashPassword(req.body.Password)
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
                    signatureId: null,
                    profileId: null
                };
                res.redirect("/profile");
            })
            .catch(() => {
                res.redirect("/register?error=email");
            });
    });

module.exports = router;
