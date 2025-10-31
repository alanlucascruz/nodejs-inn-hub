import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { StatusResponse } from "../utils/enums";
import {
  SignInRequest,
  SignInContent,
  SignInResponse,
  SignUpRequest,
  SignUpContent,
  SignUpResponse,
} from "../types";

const JWT_SECRET: string = <string>process.env.JWT_SECRET || "";

export const signIn = async (
  req: Request<{}, {}, SignInRequest>,
  res: Response<SignInResponse>
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
      message: `Erro ao entrar no sistema. ${error}`,
      status: StatusResponse.ERROR,
    });
  }
};

export const signUp = async (
  req: Request<{}, {}, SignUpRequest>,
  res: Response<SignUpResponse>
) => {
  try {
    const { name, email, password } = req.body;

    const userCreated = await User.findOne({ email });

    if (userCreated) {
      return res.status(StatusCodes.CONFLICT).json({
        status: StatusResponse.ERROR,
        message: "Usuário já existe. Por favor, faça o seu Login.",
      });
    }

    const encryptedPassword: string = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: encryptedPassword,
    });

    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

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
