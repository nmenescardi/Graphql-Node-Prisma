import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('4d5sa8dsa42wq')
  },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: 'my published post',
    body: '',
    published: true
  },
  post: undefined
};

const postTwo = {
  input: {
    title: 'my draft post',
    body: '',
    published: false
  },
  post: undefined
};

const seedDatabase = async () => {
  // delete test data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });
  userOne.jwt = jwt.sign(
    {
      userId: userOne.user.id
    },
    process.env.JWT_SECRET
  );

  // Create Post One
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });

  // Create Post Two
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
};
export { seedDatabase as default, userOne, postOne, postTwo };
