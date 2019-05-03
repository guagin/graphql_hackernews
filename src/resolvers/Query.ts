import { getUserId } from "../utils";

function info() {
  `This is the API of a Hackernews Clone`;
}

function feed(root, args, { prisma }, info) {
  return prisma.links();
}

function get(parent, { id }, { prisma }) {
  return prisma.link({ id });
}

function getUser(parent, args, context) {
  const userId = getUserId(context);
  return context.prisma.user({ id: userId });
}

export { info, feed, get, getUser };
