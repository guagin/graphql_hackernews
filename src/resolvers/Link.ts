import * as makeDebug from "debug";

const log = makeDebug("server: link");

function postedBy(parent, args, context) {
  const user = context.prisma.link({ id: parent.id }).postedBy();
  if (!user)
    return {
      id: "unknow",
      name: "unknow",
      email: "unknow",
      password: "unknow"
    };
  return user;
}

function votes(parent, args, context) {
  return context.prisma.link({ id: parent.id }).votes();
}

export { postedBy, votes };
