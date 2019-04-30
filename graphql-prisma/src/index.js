import '@babel/polyfill/noConflict';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import { resolvers, fragmentReplacements } from './resolvers/index';
import prisma from './prisma';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    return {
      request,
      db,
      pubsub,
      prisma
    };
  },
  fragmentReplacements
});

server.start(
  {
    port: process.env.PORT || 4000
  },
  () => console.log('server up...')
);
