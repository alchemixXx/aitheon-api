import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Response } from 'express';

const jwtSecretPhrase: string = process.env.JWT_SECRET_PHRASE || 'thisisverysecretphrase';

export const auth = async function (req: any, res: Response, next: Function) {
  try {
    if (req.header('Authorization')) {
      throw new Error("Can't find 'Authorization' header");
    }
    const token = req.header('Authorization')!.replace('Bearer ', '');
    const decoded: any = jwt.verify(token, jwtSecretPhrase);

    const user = await User.findOne({ _id: decoded['_id'] || null, 'tokens.token': token });

    if (!user) {
      throw new Error('Unable to login');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please, authenticate' });
  }
};

