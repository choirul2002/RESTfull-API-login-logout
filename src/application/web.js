import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRoute } from "../route/public-route.js";
import { privateRoute } from "../route/private-route.js";

export const web = express();
web.use(cors());
web.use(express.json());
web.use(publicRoute);
web.use(privateRoute);
web.use(errorMiddleware);
