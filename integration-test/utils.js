import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

const create = async () => {
  const account = await prismaClient.accounts.create({
    data: {
      email: "choirul@gmail.com",
      password: await bcrypt.hash("rahasia", 10),
      level: "pengunjung",
    },
  });

  return prismaClient.user.create({
    data: {
      username: "ahmad choirul huda",
      gender: "female",
      address: "indonesia",
      accountId: account.id,
    },
    select: {
      id: true,
      accounts: {
        select: {
          id: true,
        },
      },
    },
  });
};

const deleteAccount = async (request) => {
  return prismaClient.accounts.delete({
    where: {
      id: request,
    },
  });
};

const deleteUser = async (request) => {
  return prismaClient.user.delete({
    where: {
      id: request,
    },
  });
};

export { create, deleteAccount, deleteUser };
