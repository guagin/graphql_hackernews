function links(parent, args, context) {
  return context.prisma.user({ id: parent.id }).links();
}

export { links };
