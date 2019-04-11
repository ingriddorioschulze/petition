const supertest = require("supertest");
const app = require("./index");
const cookieSession = require("cookie-session");

test("users are logged out are redirected to registration page", () => {
    return supertest(app)
        .get("/petition")
        .expect(302)
        .expect("location", "/register");
});

test("Users are logged in are redirected to the petition page > registration page", () => {
    cookieSession.mockSessionOnce({
        user: {}
    });
    return supertest(app)
        .get("/register")
        .expect(302)
        .expect("location", "/petition");
});

test("Users are logged in are redirected to the petition page > login page", () => {
    cookieSession.mockSessionOnce({
        user: {}
    });
    return supertest(app)
        .get("/login")
        .expect(302)
        .expect("location", "/petition");
});

test("Users are logged in are redirected to the petition page > petition page", () => {
    cookieSession.mockSessionOnce({
        user: {
            signatureId: 5
        }
    });
    return supertest(app)
        .get("/petition")
        .expect(302)
        .expect("location", "/petition/signed");
});

test("Users are logged in are redirected to the petition page > submit signature", () => {
    cookieSession.mockSessionOnce({
        user: {
            signatureId: 5
        }
    });
    return supertest(app)
        .post("/petition")
        .expect(302)
        .expect("location", "/petition/signed");
});

test("Users are logged in and have not signed the petition are redirected to the petition page > thank you page", () => {
    cookieSession.mockSessionOnce({
        user: {
            signatureId: null
        }
    });
    return supertest(app)
        .get("/petition/signed")
        .expect(302)
        .expect("location", "/petition");
});

test("Users are logged in and have not signed the petition are redirected to the petition page > signers page", () => {
    cookieSession.mockSessionOnce({
        user: {
            signatureId: null
        }
    });
    return supertest(app)
        .get("/petition/signers")
        .expect(302)
        .expect("location", "/petition");
});
