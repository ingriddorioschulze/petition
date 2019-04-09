const express = require("express");
const db = require("./db");
const password = require("./password");

const router = express.Router();

router
    .route("/profile")
    .get((req, res) => {
        if (req.session.user.profileId == null) {
            res.render("profile");
        } else {
            res.redirect("/petition");
        }
    })

    .post((req, res) => {
        if (
            req.body.Homepage.indexOf("http://") !== 0 &&
            req.body.Homepage.indexOf("https://") !== 0 &&
            req.body.Homepage !== ""
        ) {
            return res.redirect("/profile?error=invalidhomepage");
        }
        db.saveProfile(
            req.session.user.id,
            req.body.Age,
            req.body.City,
            req.body.Homepage
        ).then(() => {
            res.redirect("/petition");
        });
    });

router
    .route("/profile/edit")
    .get((req, res) => {
        db.getEditProfile(req.session.user.id).then(editProfile => {
            res.render("profileEdit", editProfile);
        });
    })

    .post((req, res) => {
        if (
            req.body.Homepage.indexOf("http://") !== 0 &&
            req.body.Homepage.indexOf("https://") !== 0 &&
            req.body.Homepage !== ""
        ) {
            return res.redirect("/profile/edit?error=invalidhomepage");
        }
        let passwordPromise;
        if (req.body.Password === "") {
            passwordPromise = Promise.resolve();
        } else {
            passwordPromise = password.hashPassword(req.body.Password);
        }
        passwordPromise
            .then(hashedPassword => {
                return db.updateProfile(
                    req.session.user.id,
                    req.body.FirstName,
                    req.body.LastName,
                    req.body.Email,
                    hashedPassword,
                    req.body.Age,
                    req.body.City,
                    req.body.Homepage
                );
            })
            .then(() => {
                req.session.user.firstName = req.body.FirstName;
                req.session.user.lastName = req.body.LastName;
                res.redirect("/petition/signed");
            });
    });

module.exports = router;
