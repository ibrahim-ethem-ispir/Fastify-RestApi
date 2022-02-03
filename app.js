const fastify = require("fastify")({ logger: true });
const dotenv = require("dotenv").config({ path: "./src/config/.env" });
const port = process.env.PORT || 3003;
const router = require("./src/router/authRouter");
fastify.register(require("fastify-cors"));
const fastifySession = require("fastify-session");
const fastifyCookie = require("fastify-cookie");

require("./src/config/database");
fastify.get("/", async (req, reply) => {
  return { message: "Merhaba" };
});

// sessions
fastify.register(fastifyCookie,{maxAge:60*60*1000});
fastify.register(fastifySession, { secret: process.env.SESSION_SECRET_KEY });

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
