const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pobsub }, info) {
      const post = db.posts.find(post => post.id === postId && post.published);

      if (!post) throw new Error('Post not found');

      return pobsub.asyncIterator(`comment ${postId}`);
    }
  },
  post: {
    subscribe(parent, args, { pobsub }, info) {
      return pobsub.asyncIterator('post');
    }
  }
};

export default Subscription;
