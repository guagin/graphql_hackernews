import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { APP_SECRET } from "../constant";
import { getUserId } from "../utils";

import * as makeDebug from "debug";
const log = makeDebug("server: mutation");

function post(parent, { description, url }, context) {
  const userId = getUserId(context);
  log(`user[${userId}] create new link post:${description} : ${url}`);
  return context.prisma.createLink({
    description,
    url,
    postedBy: { connect: { id: userId } }
  });
}

async function update(parent, { id, url, description }, { prisma }) {
  log(`try to update ${id} , ${url}, ${description}`);
  const link = await prisma.updateLink({
    data: {
      url,
      description
    },
    where: {
      id
    }
  });
  log(`${JSON.stringify(link)}`);
  return link;
}

async function deleteLink(parent, { id }, { prisma }) {
  log(`try to delete post:${id}`);
  return prisma.deleteLink({ id });
}

async function signUp(parent, { name, email, password }, context, info) {
  const passwordHashed = await bcrypt.hash(password, 10);
  const user = await context.prisma.createUser({
    name,
    email,
    password: passwordHashed
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
}

async function login(parent, { email, password }, { prisma }, info) {
  const user = await prisma.user({ email });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user
  };
}

async function vote(parent, args, context, info) {
  const userId = getUserId(context);
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });
  if (linkExists) {
    throw new Error(`Already vote for link:${args.linkId}`);
  }
  return await context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
}

export { post, update, deleteLink, signUp, login, vote };
