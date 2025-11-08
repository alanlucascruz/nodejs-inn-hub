import { HydratedDocument } from "mongoose";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { StatusResponse } from "../utils/enums";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import {
  User as IUser,
  SignInReqBody,
  SignInContent,
  SignInResBody,
  SignUpReqBody,
  SignUpContent,
  SignUpResBody,
} from "../types";

const JWT_SECRET: string = <string>process.env.JWT_SECRET || "";

export const signIn = async (
  req: Request<{}, {}, SignInReqBody>,
  res: Response<SignInResBody>
) => {
  try {
    const { email, password }: SignInReqBody = req.body;

    const user: HydratedDocument<IUser> | null = await User.findOne({
      email,
    }).select("+password");

    const invalidPasswordResponse = () => {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusResponse.ERROR,
        message: "E-mail e/ou senha inválidos.",
      });
    };

    if (!user) {
      return invalidPasswordResponse();
    }

    const match: boolean = await bcrypt.compare(password, user.password);

    if (!match) {
      return invalidPasswordResponse();
    }

    const token: string = jwt.sign({ _id: user._id }, JWT_SECRET);

    const content: SignInContent = {
      email: user.email,
      name: user.name,
      token,
    };

    res.json({ status: StatusResponse.OK, content });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao entrar no sistema. ${error}`,
    });
  }
};

export const signUp = async (
  req: Request<{}, {}, SignUpReqBody>,
  res: Response<SignUpResBody>
) => {
  try {
    const { name, email, password }: SignUpReqBody = req.body;

    const userCreated: IUser | null = await User.findOne({ email });

    if (userCreated) {
      return res.status(StatusCodes.CONFLICT).json({
        status: StatusResponse.ERROR,
        message: "Usuário já existe. Por favor, faça o seu Login.",
      });
    }

    const encryptedPassword: string = await bcrypt.hash(password, 10);

    const user: HydratedDocument<IUser> = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    const token: string = jwt.sign({ _id: user._id }, JWT_SECRET);

    const content: SignUpContent = {
      email: user.email,
      name: user.name,
      token,
    };

    res.status(StatusCodes.CREATED).json({
      status: StatusResponse.OK,
      content,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao registrar o usuário. ${error}`,
    });
  }
};
