const express = require("express");
const db = require("./db");
const password = require("./password");

const router = express.Router();

router
    .route("/login")
    .get((req, res) => {
        if (req.session.user !== undefined) {
            res.redirect("/petition");
        } else {
            res.render("login", {
                erroruser: req.query.erroruser,
                errorpass: req.query.errorpass
            });
        }
    })

    .post((req, res) => {
        db.getUser(req.body.Email).then(user => {
            if (user == null) {
                return res.redirect("/login?erroruser=usernotfound");
            }

            password
                .checkPassword(req.body.Password, user.password)
                .then(doesMatch => {
                    if (doesMatch == true) {
                        req.session.user = {
                            id: user.user_id,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            signatureId: user.signature_id,
                            profileId: user.profile_id
                        };
                        if (user.profile_id == null) {
                            res.redirect("/profile");
                        } else if (user.signature_id == null) {
                            res.redirect("/petition");
                        } else {
                            res.redirect("/petition/signed");
                        }
                    } else {
                        res.redirect("/login?errorpass=wrongpassword");
                    }
                });
        });
    });

module.exports = router;
