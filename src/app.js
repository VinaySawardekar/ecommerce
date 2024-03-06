const port = 4000;
const { createServer } = require("./utility/server");
const { initial } = require("./utility/helper");

const app = createServer();

app.listen(port, () => {
  console.log("Ecommerce Web App.");
  console.log(`App listening on http://localhost:${port}`);
  initial();
});

module.exports = app;
