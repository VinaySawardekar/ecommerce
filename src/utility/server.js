const express = require("express");
const router = require("../routes");
const swaggerUI = require("swagger-ui-express");

const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use("/api", router);

  const swaggerFile = require("../../public/api-docs/swagger-output.json");
  app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerFile, {
      swaggerOptions: { persistAuthorization: true },
    })
  );

  app.get("/health-check", (req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      message: "Ok",
      timestamp: Date.now(),
    };
    res.send(healthcheck);
  });

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Ecommerce Portal." });
  });

  return app;
};

module.exports = { createServer };
