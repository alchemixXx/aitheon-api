import request from 'request';
import { IGeneratedUser } from '../interfaces';

export const generateRandomUser = (callback: Function) => {
  const url: string = 'https://randomuser.me/api/';
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Some troubles occured;\n', undefined);
    } else {
      const generatedUser: IGeneratedUser = {
        name: body.results[0].login.username,
        password: body.results[0].login.password,
        email: body.results[0].email,
        picture: body.results[0].picture,
      };
      callback(undefined, generatedUser);
    }
  });
};
