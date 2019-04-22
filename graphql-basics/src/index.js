import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid';
import uuidv4 from 'uuid/v4';

//demo user data
let users = [
  {
    id: '1',
    name: 'Steve',
    email: 'steve@jobs.com'
  },
  {
    id: '2',
    name: 'Scott',
    email: 'scott@audio.com'
  },
  {
    id: '3',
    name: 'Matt',
    email: 'matt@wp.com'
  }
];

let posts = [
  {
    id: '55',
    title:
      'Trump, seething after Mueller report, trains his ire at ex-counsel McGahn',
    body:
      'Some of the report’s most derogatory scenes were attributed not only to the recollections of former White House counsel Donald McGahn and other witnesses, but also to notes kept by aides.',
    published: false,
    author: '1'
  },
  {
    id: '56',
    title:
      'How a legal dispute between Mueller and Barr drove the end of the Russia probe',
    body:
      'The special counsel’s decision to not reach a conclusion about whether the president had obstructed justice stumped lawyers and frustrated senior Justice officials.',
    published: true,
    author: '2'
  },
  {
    id: '57',
    title:
      'Mueller punted big questions to a Congress ill-equipped to deal with them',
    body:
      'The body is hyperpartisan and more focused on the 2020 election than issues of presidential criminality and liability.',
    published: true,
    author: '2'
  }
];

let comments = [
  {
    id: '1',
    text: 'comentario 1',
    author: '1',
    post: '55'
  },
  {
    id: '2',
    text: 'comentario 2',
    author: '3',
    post: '55'
  },
  {
    id: '3',
    text: 'comentario 3',
    author: '2',
    post: '56'
  },
  {
    id: '4',
    text: 'comentario 4',
    author: '1',
    post: '57'
  }
];

// Type definitions (schema)
const typeDefs = `
type Query {
  users(query: String): [User!]!
  posts(query: String): [Post!]!
  comments: [Comment!]!
  me: User!
  post: Post!
}

type Mutation {
  createUser(data: createUserInput): User!
  deleteUser(id: ID!): User!
  createPost(data: createPostInput): Post!
  deletePost(id: ID!): Post!
  createComment(data: createCommentInput): Comment!
}

input createUserInput {
  name: String! 
  email: String!
  age: Int
}

input createPostInput {
  title: String! 
  body: String! 
  published: Boolean! 
  author: ID!
}

input createCommentInput {
  text: String! 
  author: ID! 
  post: ID!
}

type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
  comments: [Comment!]!
}

type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean!
  author: User!
  comments: [Comment!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}

`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      const { query } = args;
      if (!query) {
        return users;
      } else {
        return users.filter(user =>
          user.name.toLowerCase().includes(query.toLowerCase())
        );
      }
    },
    posts(parent, args, ctx, info) {
      const { query } = args;
      if (!query) return posts;
      else
        return posts.filter(
          post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        );
    },
    comments(parent, args, ctx, info) {
      return comments;
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
    createUser(parent, args, ctx, info) {
      const emailToken = users.some(user => user.email === args.data.email);

      if (emailToken) throw new Error(`Email ${args.data.email} is taken`);

      const user = {
        id: uuidv4(),
        ...args.data
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (userIndex === -1) throw new Error('user not exist');

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return match;
      });

      comments = comments.filter(comment => comment.author !== args.id);

      return deletedUsers[0];
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex(post => post.id === args.id);

      if (postIndex === -1) throw new Error('Post not found.');

      const deletedPosts = posts.splice(postIndex, 1);

      comments.filter(comment => comment.post !== args.id);
      return deletedPosts[0];
    },
    createPost(parent, args, ctx, info) {
      const userExist = users.some(user => user.id === args.data.author);

      if (!userExist)
        throw new Error(`User with id ${args.data.author} does not exist.`);

      const post = {
        id: uuidv4(),
        ...args.data
      };

      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExist = users.some(user => user.id === args.data.author);
      const postExist = posts.some(
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

      comments.push(comment);
      return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => parent.id === post.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => parent.id === comment.author);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => parent.author === user.id);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log('server up...'));
