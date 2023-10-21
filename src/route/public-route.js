import express from "express";
import userController from "../controller/user-controller.js";

export const publicRoute = express.Router();
publicRoute.post("/users/registration", userController.registrasi);
publicRoute.post("/users/login", userController.login);
