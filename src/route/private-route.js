import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

export const privateRoute = express.Router();

privateRoute.use(authMiddleware);
privateRoute.delete("/users/logout", userController.logout);
