const express = require("express");
const db = require("./db");

const router = express.Router();

function checkSigned(request, response, next) {
    if (request.session.user.signatureId !== null) {
        response.redirect("/petition/signed");
    } else {
        next();
    }
}

router
    .route("/petition")
    .get(checkSigned, (req, res) => {
        res.render("home", {});
    })
    .post(checkSigned, (req, res) => {
        if (req.body.Signature === "") {
            return res.redirect("/petition?error=emptysignature");
        }
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

router.get("/petition/signed", (req, res) => {
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

router.get("/petition/signers", (req, res) => {
    db.getSignatures().then(signatures => {
        res.render("signers", {
            signatures: signatures
        });
    });
});

router.get("/petition/signers/:city", (req, res) => {
    db.getSignaturesCity(req.params.city).then(signatures => {
        res.render("signers", {
            signatures: signatures
        });
    });
});

module.exports = router;
