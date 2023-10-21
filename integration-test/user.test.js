import { create, deleteAccount, deleteUser } from "./utils.js";
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe("POST /users/registration", () => {
  it("should registrations success", async () => {
    const result = await supertest(web).post("/users/registration").send({
      email: "choirul@gmail.com",
      password: "rahasia",
      level: "pengunjung",
      username: "ahmad choirul huda",
      gender: "female",
      address: "indonesia",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.username).toBeDefined();
    expect(result.body.data.gender).toBeDefined();
    expect(result.body.data.address).toBeDefined();
    expect(result.body.data.accounts.email).toBe("choirul@gmail.com");
    expect(result.body.data.accounts.level).toBe("pengunjung");

    const user = await deleteUser(result.body.data.id);
    await deleteAccount(user.accountId);
  });

  it("should reject if request invalid", async () => {
    const result = await supertest(web).post("/users/registration").send({
      email: "choirul@gmai",
      password: "",
      level: "",
      username: "",
      gender: "",
      address: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("should reject if user already exixts", async () => {
    const user = await create();

    const result = await supertest(web).post("/users/registration").send({
      email: "choirul@gmail.com",
      password: "rahasia",
      level: "pengunjung",
      username: "ahmad choirul huda",
      gender: "female",
      address: "indonesia",
    });
    logger.info(result.body);
    expect(result.status).toBe(409);
    expect(result.body.error).toBeDefined();

    await deleteUser(user.id);
    await deleteAccount(user.accounts.id);
  });
});

describe("POST /users/login", () => {
  it("should can login", async () => {
    const user = await create();
    const result = await supertest(web).post("/users/login").send({
      email: "choirul@gmail.com",
      password: "rahasia",
    });
    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.secret).toBeDefined();
    await deleteUser(user.id);
    await deleteAccount(user.accounts.id);
  });
  it("should reject if request invalid", async () => {
    const user = await create();
    const result = await supertest(web).post("/users/login").send({
      email: "choirul@gmai",
      password: "",
    });
    logger.info(result.body);
    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
    await deleteUser(user.id);
    await deleteAccount(user.accounts.id);
  });
  it("should reject if account user invalid", async () => {
    const user = await create();
    const result = await supertest(web).post("/users/login").send({
      email: "choirul@gmail.com",
      password: "sldfjlskdjf",
    });
    logger.info(result.body);
    expect(result.status).toBe(404);
    expect(result.body.error).toBeDefined();
    await deleteUser(user.id);
    await deleteAccount(user.accounts.id);
  });
});

describe("DELETE /users/logout", () => {
  it("should can logout", async () => {
    const user = await create();
    const login = await supertest(web).post("/users/login").send({
      email: "choirul@gmail.com",
      password: "rahasia",
    });

    const result = await supertest(web).delete("/users/logout").set({
      authorization: login.body.data.token,
      secret: login.body.data.secret,
    });

    logger.info(result.body);
    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    await deleteUser(user.id);
    await deleteAccount(user.accounts.id);
  });

  it("should can logout", async () => {
    const user = await create();
    await supertest(web).post("/users/login").send({
      email: "choirul@gmail.com",
      password: "rahasia",
    });

    const result = await supertest(web).delete("/users/logout");

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();

    await deleteUser(user.id);
    await deleteAccount(user.accounts.id);
  });

  it("should can logout", async () => {
    const user = await create();
    await supertest(web).post("/users/login").send({
      email: "choirul@gmail.com",
      password: "rahasia",
    });

    const result = await supertest(web).delete("/users/logout").set({
      authorization: "sdfisdjflisdjflksjdlfjsldjflksdjf",
      secret: "sdlfjslkdjflsdjflsjdlfsdl",
    });

    logger.info(result.body);
    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();

    await deleteUser(user.id);
    await deleteAccount(user.accounts.id);
  });
});
