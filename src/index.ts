import * as _ from "lodash";
import * as makeDebug from "debug";
const { GraphQLServer } = require("graphql-yoga");
const log = makeDebug("server");

const links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    get: (parent, { id }) => {
      const link = _.find(links, link => {
        return link.id === id;
      });
      if (!link) {
        throw new Error(`Link[${id}] not exists`);
      }
      return link;
    }
  },
  Mutation: {
    post: (parent, { description, url }) => {
      const link = {
        id: `link-${idCount++}`,
        description,
        url
      };
      links.push(link);
      return link;
    },
    update: (parent, { id, url, description }) => {
      const link = _.find(links, link => {
        return link.id === id;
      });
      if (!link) {
        throw new Error(`Link[${id}] not exists`);
      }

      link.url = url;
      link.description = description;

      return link;
    },
    delete: (parent, { id }) => {
      const removed = _.remove(links, link => {
        return link.id === id;
      });
      log(`removed: ${JSON.stringify(removed)}`);
      return removed.length > 0;
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
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
