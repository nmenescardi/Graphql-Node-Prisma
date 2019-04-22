const Query = {
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
};

export default Query;
