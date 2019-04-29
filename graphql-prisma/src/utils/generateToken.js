import jwt from 'jsonwebtoken';

const generateToken = userId => {
  jwt.sign({ userId }, 'thisissecret', { expiresIn: '7 days' });
};

export default generateToken;
