import {
  loginValidation,
  logoutValidation,
  registrasiValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validate.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const registrasi = async (request) => {
  request = validate(registrasiValidation, request);

  const { email, password, level, username, gender, address } = request;

  const checkDataInDatabase = await prismaClient.accounts.findFirst({
    where: {
      email: email,
    },
  });

  if (checkDataInDatabase) {
    throw new ResponseError(409, "User Already Exist");
  }

  request.password = await bcrypt.hash(request.password, 10);

  const account = await prismaClient.accounts.create({
    data: {
      email: email,
      password: password,
      level: level,
    },
    select: {
      id: true,
    },
  });

  return prismaClient.user.create({
    data: {
      username: username,
      gender: gender,
      address: address,
      accountId: account.id,
    },
    select: {
      id: true,
      username: true,
      gender: true,
      address: true,
      accounts: {
        select: {
          email: true,
          level: true,
        },
      },
    },
  });
};

const login = async (request) => {
  validate(loginValidation, request);
  const { email, password } = request;

  const checkDataInDatabase = await prismaClient.accounts.findFirst({
    where: {
      email: email,
    },
  });

  if (!checkDataInDatabase) {
    throw new ResponseError(404, "User Not Found");
  }

  const isValid = await bcrypt.compare(password, checkDataInDatabase.password);

  if (!isValid) {
    throw new ResponseError(404, "User Not Found");
  }

  const { id, username, level } = checkDataInDatabase;

  const payload = {
    idAccount: id,
    username: username,
    level: level,
  };

  const secret = uuid().toString();

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  return {
    token: token,
    secret: secret,
  };
};

const logout = async (user) => {
  const { idAccount } = user;

  validate(logoutValidation, idAccount);

  const checkDataInDatabase = await prismaClient.accounts.findUnique({
    where: {
      id: idAccount,
    },
  });

  if (!checkDataInDatabase) {
    throw new ResponseError(404, "User Not Found");
  }

  return "OK";
};

export default { registrasi, login, logout };
