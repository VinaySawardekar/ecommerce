const { setupDB } = require("./testConfig");
const app = require("../src/app");
const chai = require("chai");
let chaiHttp = require("chai-http");
let expect = chai.expect;
let userId = null,
  productId = null,
  orderId = null;

setupDB();

chai.use(chaiHttp);

describe("E-COMMERCE API Routes", () => {
  it("GET /user : It should get all users", async function () {
    const res = await chai.request(app).get("/api/user/");
    console.log(res.body);
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("User Details fetched Successfully!");
  });

  it("GET /users : It should get error", async function () {
    const res = await chai.request(app).get("/api/users/");
    expect(res.statusCode).to.equal(404);
    expect(res.notFound).to.equal(true);
  });

  it("POST /user : It should create new user", async function () {
    const res = await chai.request(app).post("/api/user/").send({
      name: "Test User",
      email: "test@example.com",
      mobile: "9988332211",
      address: "Test Address",
    });
    userId = res.body.data[0].id;
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("User Created Successfully!");
  });

  it("POST /user : It should give error for new user (Duplicate Email)", async function () {
    const res = await chai.request(app).post("/api/user/").send({
      name: "Test User 2",
      email: "test@example.com",
      mobile: "9988332211",
      address: "Test Address",
    });
    expect(res.statusCode).to.equal(400);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("User Creation Failed! Duplicate Email!");
  });

  it("POST /user : It should give error for new user (Missing Email)", async function () {
    const res = await chai.request(app).post("/api/user/").send({
      name: "Test User 2",
      mobile: "9988332211",
      address: "Test Address",
    });
    expect(res.statusCode).to.equal(500);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Internal Server Error");
  });

  it("GET /user/id : It should get user by id", async function () {
    const res = await chai.request(app).get(`/api/user/${userId}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("User Details fetched Successfully!");
  });

  it("GET /user/id : It should failed to get user by id", async function () {
    const res = await chai.request(app).get(`/api/user/999`);
    expect(res.statusCode).to.equal(400);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("User Not Found!");
  });

  it("PUT /user : It should update user by id", async function () {
    const res = await chai.request(app).put(`/api/user/${userId}`).send({
      name: "Test User",
      email: "test@gmail.com",
      mobile: "9988332211",
      address: "Test Address Delhi",
    });
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("User Updated Successfully!");
  });

  it("PUT /user : It should not update user by id", async function () {
    const res = await chai.request(app).put(`/api/user/${userId}`).send({
      name: "Test User",
      email: "test@gmail.com",
      address: "Test Address Delhi",
    });
    expect(res.statusCode).to.equal(500);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Internal Server Error");
  });

  it("GET /product : It should get all product", async function () {
    const res = await chai.request(app).get("/api/product/");
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Product Details fetched Successfully!");
  });

  it("GET /product : It should get error", async function () {
    const res = await chai.request(app).get("/api/products/");
    expect(res.statusCode).to.equal(404);
    expect(res.notFound).to.equal(true);
  });

  it("POST /product : It should create new product", async function () {
    const res = await chai.request(app).post("/api/product/").send({
      name: "Product",
      description: "Product description",
      stock: "50",
      price: "5999",
    });
    productId = res.body.data[0].id;
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Product Created Successfully!");
  });

  it("POST /product : It should give error for new product (Missing description)", async function () {
    const res = await chai.request(app).post("/api/product/").send({
      name: "Product 2",
      stock: "50",
      price: "5999",
    });
    expect(res.statusCode).to.equal(500);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Internal Server Error");
  });

  it("GET /product/id : It should get product by id", async function () {
    const res = await chai.request(app).get(`/api/product/${productId}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Product Details fetched Successfully!");
  });

  it("GET /product/id : It should failed to get product by id", async function () {
    const res = await chai.request(app).get(`/api/product/999`);
    expect(res.statusCode).to.equal(400);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Product Not Found!");
  });

  it("PUT /product : It should update product by id", async function () {
    const res = await chai.request(app).put(`/api/product/${productId}`).send({
      name: "Product",
      description: "test@gmail.com",
      stock: "50",
      price: "1000",
    });
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Product Updated Successfully!");
  });

  it("PUT /product : It should not update product by id", async function () {
    const res = await chai.request(app).put(`/api/product/${productId}`).send({
      name: "Product",
      description: "test@gmail.com",
      price: "1000",
    });
    expect(res.statusCode).to.equal(500);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Internal Server Error");
  });

  it("GET /order : It should get all order", async function () {
    const res = await chai.request(app).get("/api/order/");
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Order Details fetched Successfully!");
  });

  it("GET /order : It should get error", async function () {
    const res = await chai.request(app).get("/api/orders/");
    expect(res.statusCode).to.equal(404);
    expect(res.notFound).to.equal(true);
  });

  it("POST /order : It should create new order", async function () {
    const res = await chai.request(app).post("/api/order/").send({
      user_id: 1,
      product_id: 1,
      order_quantity: 50,
      total_price: 5000,
    });
    orderId = res.body.data[0].id;
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Order Created Successfully!");
  });

  it("POST /order : It should give error for new order (Missing description)", async function () {
    const res = await chai.request(app).post("/api/order/").send({
      user_id: 1,
      order_quantity: 50,
      total_price: 5000,
    });
    expect(res.statusCode).to.equal(500);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Internal Server Error");
  });

  it("GET /order/id : It should get order by id", async function () {
    const res = await chai.request(app).get(`/api/order/${orderId}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Order Details fetched Successfully!");
  });

  it("GET /order/id : It should failed to get order by id", async function () {
    const res = await chai.request(app).get(`/api/order/999`);
    expect(res.statusCode).to.equal(400);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Order Not Found!");
  });

  it("PUT /order : It should update order by id", async function () {
    const res = await chai.request(app).put(`/api/order/${orderId}`).send({
      order_quantity: 50,
    });
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Order Updated Successfully!");
  });

  it("PUT /order : It should not update order by id", async function () {
    const res = await chai.request(app).put(`/api/order/${orderId}`).send({});
    expect(res.statusCode).to.equal(500);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Internal Server Error");
  });

  it("DELETE /user : It should delete user by id", async function () {
    const res = await chai.request(app).delete(`/api/user/${userId}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("User Deleted Successfully!");
  });

  it("DELETE /user : It should failed to delete user by id", async function () {
    const res = await chai.request(app).delete(`/api/user/88`);
    expect(res.statusCode).to.equal(400);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("User Not Found!");
  });

  it("DELETE /product : It should delete product by id", async function () {
    const res = await chai.request(app).delete(`/api/product/${productId}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Product Deleted Successfully!");
  });

  it("DELETE /product : It should failed to delete product by id", async function () {
    const res = await chai.request(app).delete(`/api/product/88`);
    expect(res.statusCode).to.equal(400);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Product Not Found!");
  });

  it("DELETE /order : It should delete order by id", async function () {
    const res = await chai.request(app).delete(`/api/order/${orderId}`);
    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.equal("Order Deleted Successfully!");
  });

  it("DELETE /order : It should failed to delete order by id", async function () {
    const res = await chai.request(app).delete(`/api/order/88`);
    expect(res.statusCode).to.equal(400);
    expect(res.body.status).to.equal("failure");
    expect(res.body.message).to.equal("Order Not Found!");
  });
});
