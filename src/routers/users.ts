import express, { Response, Request } from 'express';
import { User } from '../models/user';
import { IUserBase } from '../interfaces';
import { auth } from '../middleware/auth';

import { IGeneratedUser } from '../interfaces';

import { generateRandomUser } from '../utils/generate-user';

export const userRouter = express.Router();

userRouter.post('/api/users', async (req, res) => {
  const user: IUserBase = new User(req.body);

  try {
    await user.save();
    const token: string = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error });
  }
});

userRouter.post('/api/users/login', async (req: any, res: Response) => {
  try {
    const user: IUserBase = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error });
  }
});

userRouter.post('/api/users/logout', auth, async (req: any, res: Response) => {
  try {
    req.user.tokens = req.user.tokens.filter((token: { [x: string]: string }) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send({ msg: 'You are logged out' });
  } catch (error) {
    res.status(500).send();
  }
});

userRouter.get('/api/users/me', auth, async (req: any, res: Response) => {
  res.send(req.user!);
});

userRouter.get('/api/users/', async (_req: Request, res: Response) => {
  try {
    const users = await User.find({ removed: false });
    res.send(users);
  } catch (e) {
    res.status(500).send({ msg: 'Something went wrong', error: e });
  }
});

userRouter.get('/api/usere', async (_req: Request, res: Response) => {
  try {
    generateRandomUser(async (error: Error, generatedUser: IGeneratedUser) => {
      if (error) {
        return res.status(500).send({ msg: 'Can not get random user', error });
      }

      const user = new User(generatedUser);
      await user.save();
      res.send({ msg: 'User has been created', user });
    });
  } catch (e) {
    res.status(500).send({ msg: 'Something went wrong', error: e });
  }
});

userRouter.put('/api/users/me', auth, async (req: any, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'picture', 'gender'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send({ error });
  }
});

userRouter.delete('/api/users/me', auth, async (req: any, res: Response) => {
  try {
    // await req.user.remove();
    req.user['removed'] = true;
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send({ error });
  }
});
