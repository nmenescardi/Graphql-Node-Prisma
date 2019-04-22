//demo user data
const users = [
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

const posts = [
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

const comments = [
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

const db = {
  users,
  posts,
  comments
};
export default db;
