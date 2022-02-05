const fastify = require("fastify")({ logger: true });
const dotenv = require("dotenv").config({ path: "./src/config/.env" });
const port = process.env.PORT || 3003;
const router = require("./src/router/authRouter");
fastify.register(require("fastify-cors"));
const session = require("fastify-session");
const cookie = require("fastify-cookie");

require("./src/config/database");
fastify.get("/", async (req, reply) => {
  return { message: "Merhaba" };
});

// sessions
fastify.register(cookie)
fastify.register(session, 
  {secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: true, 
    cookie: {
      secure:false, 
      httpOnly: true,
      sameSite: false, 
      maxAge: 60 *60 * 24 * 1000
    }
})

/*
fastify.addHook('preHandler', (req, reply, next) => {
  req.session.sessionData = ({userId: String, name: String, email: String, password: String, loggedOn: Date},{collection:"session"})
    
  next();
})*/


const messages = {
  badRequestErrorMessage: 'Format is Authorization: Bearer [token]',
  badCookieRequestErrorMessage: 'Cookie could not be parsed in request',
  noAuthorizationInHeaderMessage: 'No Authorization was found in request.headers',
  noAuthorizationInCookieMessage: 'No Authorization was found in request.cookies',
  authorizationTokenExpiredMessage: 'Authorization token expired',
  authorizationTokenInvalid: (err) => `Authorization token is invalid: ${err.message}`,
  authorizationTokenUntrusted: 'Untrusted authorization token'
}

router.forEach((route, index) => {
  fastify.route(route);
});
const start = async () => {
  try {
    await fastify
      .listen(port)
      .then(() => {
        console.log(`Server ${port} connection successful`);
      })
      .catch((err) => {
        console.log("Server connection Error");
      });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
