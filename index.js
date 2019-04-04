const express = require("express");
const hb = require("express-handlebars");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

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

//how do we query a database from a express server?//
//any changes to a db (UPDATE, INSERT, or DELETE)//
// should be done in a POST route//
function checkSigned(request, response, next) {
    if (request.session.signed === "submitted") {
        response.redirect("/petition/signed");
    } else {
        next();
    }
}

app.get("/petition", checkSigned, (req, res) => {
    res.render("home", {});
});

app.post("/petition", checkSigned, (req, res) => {
    if (
        req.body.FirstName.trim().length === 0 ||
        req.body.LastName.trim().length === 0
    ) {
        return res.render("home", {
            error: true
        });
    }
    db.signatures(
        req.body.FirstName,
        req.body.LastName,
        req.body.Signature,
        new Date()
    )
        .then(id => {
            req.session.signed = "submitted";
            req.session.idSignatures = id;
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
    if (req.session.idSignatures) {
        db.getImageSignature(req.session.idSignatures).then(imageSignature => {
            res.render("thanks", {
                imageSignature: imageSignature
            });
        });
    } else {
        res.redirect("/petition");
    }
});

app.get("/petition/signers", (req, res) => {
    db.getSignatures().then(signatures => {
        console.log(signatures);
        res.render("signers", {
            signatures: signatures
        });
    });
});

app.listen(8080, () => console.log("Oi, petition!"));
