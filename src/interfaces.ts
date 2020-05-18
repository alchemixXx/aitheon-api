import { Timestamp } from 'mongodb';
import { Document, Model } from 'mongoose';

export interface IGeneratedUser {
  name: string;
  password: string;
  email: string;
  picture: { [x: string]: string };
}

export interface IUserSchema extends Document {
  name: string;
  gender: string;
  email: string;
  password: string;
  removed: boolean;
  tokens: ITokens[];
  picture: { [x: string]: string };
  timestamps: Timestamp;
}

interface ITokens {
  token: string;
}

export interface IUserBase extends IUserSchema {
  generateAuthToken(): Promise<string>;
}

export interface IUserModel extends Model<IUserBase> {
  findByCredentials(email: string, password: string): Promise<IUserBase>;
}
