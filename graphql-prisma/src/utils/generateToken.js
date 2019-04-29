import jwt from 'jsonwebtoken';

const generateToken = userId => {
  jwt.sign({ userId: user.id }, 'thisissecret', { expiresIn: '7 deays' });
};

export default generateToken;
