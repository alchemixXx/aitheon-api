import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jws from 'jsonwebtoken';

import { IUserBase, IUserModel } from '../interfaces';

const jwtSecretPhrase: string = process.env.JWT_SECRET_PHRASE || '';

const userSchema: Schema<IUserBase> = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      default: 'male',
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value: any): boolean {
        if (!validator.isEmail(value)) {
          throw new Error('Email is not valid');
        }

        return true;
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      validate(value: any): boolean {
        if (validator.contains(value.toLowerCase(), 'password')) {
          throw new Error('Password can not contain word "password"');
        }

        return true;
      },
    },
    removed: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    picture: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.findByCredentials = async (
  email: string,
  password: string,
): Promise<IUserBase> => {
  const user: IUserBase = (await User.findOne({ email })) as IUserBase;

  if (!user) {
    throw new Error('Unable to login');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error('Unable to login');
  }

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jws.sign({ _id: user._id.toString() }, jwtSecretPhrase);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete user.picture;

  return userObject;
};

// Hash the password before saving
userSchema.pre('save', async function (next) {
  const user: IUserBase = this as IUserBase;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

export const User = mongoose.model<IUserBase, IUserModel>('User', userSchema);
