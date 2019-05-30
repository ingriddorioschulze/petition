const express = require("express");
const hb = require("express-handlebars");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const petitionRouter = require("./petition");
const registerRouter = require("./register");
const loginRouter = require("./login");
const profileRouter = require("./profile");

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

function checkLogIn(req, res, next) {
    if (req.session.user !== undefined) {
        next();
    } else {
        res.redirect("/register");
    }
}
app.use("/petition", checkLogIn);
app.use(petitionRouter);

app.use(registerRouter);

app.use(loginRouter);

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});
app.use("/profile", checkLogIn);
app.use(profileRouter);

app.use("/previous", (req, res) => {
    res.redirect("/petition/signed");
});

app.post("/signature/delete", checkLogIn, (req, res) => {
    db.deleteSignature(req.session.user.id).then(() => {
        req.session.user.signatureId = null;
        res.redirect("/petition");
    });
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => console.log("Oi, petition!"));
}

module.exports = app;
