const fs = require("fs");
const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const appName = "Ecommerce Web Application";
const appDesc = "Ecommerce App by Group 4";

const doc = {
  info: {
    title: appName,
    description: appDesc,
  },
  host: "localhost:4000/api",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  definitions: {},
};

let outputFile = "./public/api-docs/swagger-output.json";
if (!fs.existsSync(outputFile)) {
  outputFile = fs.openSync(outputFile, "w");
}
const endpointsFiles = ["./src/routes/index.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
