import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://192.168.99.100:4466'
});

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    '{ id}'
  );
  const user = await prisma.query.user(
    {
      where: {
        id: authorId
      }
    },
    '{ id name email posts { id title published } }'
  );
  return user;
};
/* 
createPostForUser('cjusxapyo002i080842b2hckc', {
  title: 'kkkkkkkk',
  body: 'pppppppppp',
  published: true
}).then(user => {
  console.log('user', JSON.stringify(user, undefined, 2));
}); */

/* 
prisma.query.users(null, '{ id name email posts { id title } }').then(data => {
  console.log('data', JSON.stringify(data, undefined, 2));
}); */

/* 
prisma.query.comments(null, '{ id text author { id name }}').then(data => {
  console.log('data', JSON.stringify(data, undefined, 2));
});
*/

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    '{ author { id } }'
  );

  const user = await prisma.query.user(
    {
      where: {
        id: post.author.id
      }
    },
    '{ id name email posts { id title published } }'
  );

  return user;
};
/* 
updatePostForUser('cjusz6eos003e0808szc9iviq', { published: true }).then(
  user => {
    console.log('user', JSON.stringify(user, undefined, 4));
  }
);
 */
