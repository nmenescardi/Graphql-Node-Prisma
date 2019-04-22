import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid';
import uuidv4 from 'uuid/v4';
import db from './db';

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      const { query } = args;
      if (!query) {
        return db.users;
      } else {
        return db.users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
      }
    },
    posts(parent, args, { db }, info) {
      const { query } = args;
      if (!query) return db.posts;
      else
        return db.posts.filter(
          post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        );
    },
    comments(parent, args, { db }, info) {
      return db.comments;
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com'
      };
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false
      };
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailToken = db.users.some(user => user.email === args.data.email);

      if (emailToken) throw new Error(`Email ${args.data.email} is taken`);

      const user = {
        id: uuidv4(),
        ...args.data
      };

      db.users.push(user);

      return user;
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => user.id === args.id);

      if (userIndex === -1) throw new Error('user not exist');

      const deletedUsers = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id);
        }

        return match;
      });

      db.comments = db.comments.filter(comment => comment.author !== args.id);

      return deletedUsers[0];
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex(post => post.id === args.id);

      if (postIndex === -1) throw new Error('Post not found.');

      const deletedPosts = db.posts.splice(postIndex, 1);

      db.comments.filter(comment => comment.post !== args.id);
      return deletedPosts[0];
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        comment => comment.id === args.id
      );

      if (commentIndex === -1) throw new Error('Comment not found.');

      return db.comments.splice(commentIndex, 1)[0];
    },
    createPost(parent, args, { db }, info) {
      const userExist = db.users.some(user => user.id === args.data.author);

      if (!userExist)
        throw new Error(`User with id ${args.data.author} does not exist.`);

      const post = {
        id: uuidv4(),
        ...args.data
      };

      db.posts.push(post);
      return post;
    },
    createComment(parent, args, { db }, info) {
      const userExist = db.users.some(user => user.id === args.data.author);
      const postExist = db.posts.some(
        post => post.id === args.data.post && post.published
      );

      if (!userExist)
        throw new Error(`User with id ${args.data.author} does not exist.`);

      if (!postExist)
        throw new Error(
          `Post with id ${args.data.post} does not exist or is not published.`
        );

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      db.comments.push(comment);
      return comment;
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => parent.id === post.author);
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => parent.id === comment.author);
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find(user => parent.author === user.id);
    },
    post(parent, args, { db }, info) {
      return db.posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db }
});

server.start(() => console.log('server up...'));
