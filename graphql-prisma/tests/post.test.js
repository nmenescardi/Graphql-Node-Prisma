import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

const timeout = 100000;

beforeEach(seedDatabase, timeout);

test(
  'Should Post entity expose publish posts as public',
  async () => {
    const getPosts = gql`
      query {
        posts {
          id
          title
          body
          published
        }
      }
    `;

    const response = await client.query({
      query: getPosts
    });

    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].published).toBe(true);
  },
  timeout
);

test(
  'Should fetch users post',
  async () => {
    const client = getClient(userOne.jwt);
    const myPosts = gql`
      query {
        myPosts {
          id
          title
          body
          published
        }
      }
    `;

    const { data } = await client.query({
      query: myPosts
    });

    expect(data.myPosts.length).toBe(2);
  },
  timeout
);
