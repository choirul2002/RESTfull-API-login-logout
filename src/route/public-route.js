import express from "express";
import userController from "../controller/user-controller.js";
import swagger from "swagger-ui-express";
import apiDocs from "../api-docs-management/restfull-api.json" assert { type: "json" };

export const publicRoute = express.Router();
publicRoute.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
publicRoute.post("/users/registration", userController.registrasi);
publicRoute.post("/users/login", userController.login);
