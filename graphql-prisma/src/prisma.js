import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://192.168.99.100:4466',
  secret: 'thisismysupersecrettext',
  fragmentReplacements
});

export default prisma;
/* 
prisma.exists
  .Comment({
    id: 'cjusxh4na002s0808okqrdk4w',
    text: 'pautaso es malisimo',
    author: {
      id: 'cjusxapyo002i080842b2hckc'
    }
  })
  .then(exist => console.log('exist', exist)); */
/* 
const createPostForUser = async (authorId, data) => {
  const userExist = await prisma.exists.User({
    id: authorId
  });

  if (!userExist) {
    throw new Error('User not found');
  }

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
    '{ author { id name email posts { id title published } } }'
  );

  return post.author;
}; */
/* 
createPostForUser('cjusuboou00130808yulht921', {
  title: 'nuevo titulo',
  body: 'cuerpazo',
  published: true
})
  .then(user => {
    console.log('user', JSON.stringify(user, undefined, 2));
  })
  .catch(error => console.log('error', error.message));
*/
/* 
prisma.query.users(null, '{ id name email posts { id title } }').then(data => {
  console.log('data', JSON.stringify(data, undefined, 2));
}); */

/* 
prisma.query.comments(null, '{ id text author { id name }}').then(data => {
  console.log('data', JSON.stringify(data, undefined, 2));
});
*/
/* 
const updatePostForUser = async (postId, data) => {
  const postExist = await prisma.exists.Post({
    id: postId
  });

  if (!postExist) throw new Error('Post not found.');

  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    '{ author { id name email posts { id title published } } }'
  );

  return post.author;
}; */
/* 
updatePostForUser('cjusz6eos003e0808szc9iviq', { published: false })
  .then(user => {
    console.log('user', JSON.stringify(user, undefined, 4));
  })
  .catch(error => console.log('error.message: ', error.message)); */
