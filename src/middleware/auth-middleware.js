import { ResponseError } from "../error/response-error.js";
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = req.headers.secret;

  if (!token) {
    throw new ResponseError(401, "Unauthorization");
  } else {
    jwt.verify(token, secret, (err, decode) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new ResponseError(401, "Token Expired");
        } else {
          throw new ResponseError(401, "Token Invalid");
        }
      } else {
        req.user = decode;
        next();
      }
    });
  }
};
