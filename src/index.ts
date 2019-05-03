import * as _ from "lodash";
import * as makeDebug from "debug";
import { prisma } from "./generated/prisma-client";

const { GraphQLServer } = require("graphql-yoga");
const log = makeDebug("server");

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, { prisma }, info) => prisma.links(),
    get: (parent, { id }, { prisma }) => {
      return prisma.link({ id });
    }
  },
  Mutation: {
    post: (parent, { description, url }, { prisma }) => {
      return prisma.createLink({
        description,
        url
      });
    },
    update: (parent, { id, url, description }) => {
      //   if (!link) {
      //     throw new Error(`Link[${id}] not exists`);
      //   }
      //   link.url = url;
      //   link.description = description;
      //   return link;
    },
    delete: (parent, { id }) => {
      //   log(`removed: ${JSON.stringify(removed)}`);
      //   return removed.length > 0;
    }
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { prisma }
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
