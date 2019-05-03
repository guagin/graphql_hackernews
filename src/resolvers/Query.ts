function info() {
  `This is the API of a Hackernews Clone`;
}

function feed(root, args, { prisma }, info) {
  return prisma.links();
}

function get(parent, { id }, { prisma }) {
  return prisma.link({ id });
}

export { info, feed, get };
