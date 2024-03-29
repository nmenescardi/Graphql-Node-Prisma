import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

const timeout = 100000;

beforeEach(seedDatabase, timeout);

test(
  'Should create a new user',
  async () => {
    const createUser = gql`
      mutation {
        createUser(
          data: {
            name: "Nicolas"
            email: "nico_M@hotmail.com"
            password: "pass1234wp"
          }
        ) {
          token
          user {
            id
          }
        }
      }
    `;

    const response = await client.mutate({
      mutation: createUser
    });

    const exists = await prisma.exists.User({
      id: response.data.createUser.user.id
    });
    expect(exists).toBe(true);
  },
  timeout
);

test(
  'Should User expose public profiles',
  async () => {
    const getUsers = gql`
      query {
        users {
          id
          name
          email
        }
      }
    `;

    const response = await client.query({
      query: getUsers
    });

    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe('Jen');
  },
  timeout
);

test(
  'Should not login with bad credentials',
  async () => {
    const login = gql`
      mutation {
        login(
          data: { email: "bad@email.com", password: "dsaiocxzioudsabiocs" }
        ) {
          token
        }
      }
    `;

    await expect(
      client.mutate({
        mutation: login
      })
    ).rejects.toThrow();
  },
  timeout
);

test(
  'Should not signup user with invalid password',
  async () => {
    const createUser = gql`
      mutation {
        createUser(
          data: { name: "carucha", email: "car@aa.tk", password: "pass" }
        ) {
          token
        }
      }
    `;

    await expect(client.mutate({ mutation: createUser })).rejects.toThrow();
  },
  timeout
);

test(
  'Should fetch user profile',
  async () => {
    const client = getClient(userOne.jwt);
    const getProfile = gql`
      query {
        me {
          id
          name
          email
        }
      }
    `;

    const { data } = await client.query({
      query: getProfile
    });

    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.name).toBe(userOne.user.name);
    expect(data.me.email).toBe(userOne.user.email);
  },
  timeout
);
