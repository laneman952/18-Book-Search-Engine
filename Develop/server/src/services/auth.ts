import type { Request } from 'express';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = ({req} : {req:Request}) => {
  const authHeader = req.headers.authorization || req.body.token || req.query.token;
  let token = '';

  if (req.headers.authorization) {
     token = authHeader.split(' ')[1];
  }
  if (!token) {
    return req; // Unauthorized
  }
  try {
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const {data}: any =  jwt.verify(token, secretKey, { maxAge: '1h' });
    req.user = data as JwtPayload;
  }
  catch (error) {
    console.log('Error in authenticateToken:', error);
  }
  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export class AuthError extends GraphQLError {
  constructor(message: string) {
    super(message);
    Object.defineProperty(this, 'name', {
      value: 'AuthError'})
  }
}
