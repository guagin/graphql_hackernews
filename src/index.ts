import * as _ from "lodash";
import * as makeDebug from "debug";
import { prisma } from "./generated/prisma-client";
import * as Query from "./resolvers/Query";
import * as Mutation from "./resolvers/Mutation";
import * as User from "./resolvers/User";
import * as Link from "./resolvers/Link";
import * as Subscription from "./resolvers/Subscription";
import * as Vote from "./resolvers/Vote";
//TODO: read graphql-yoga
const { GraphQLServer } = require("graphql-yoga");

const log = makeDebug("server");

const resolver = {
  Query,
  Mutation,
  User,
  Link
};

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  Subscription,
  Vote
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => {
    return {
      ...request,
      prisma
    };
  }
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
