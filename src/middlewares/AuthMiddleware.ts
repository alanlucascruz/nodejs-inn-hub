import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { DefaultLocals, DefaultResponse } from "../types";
import { StatusResponse } from "../utils/enums";
import { StatusCodes } from "http-status-codes";

const JWT_SECRET: string = <string>process.env.JWT_SECRET || "";

export default (
  req: Request,
  res: Response<DefaultResponse, DefaultLocals>,
  next: NextFunction
) => {
  try {
    const token: string | null = <string>req.header("token");

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusResponse.ERROR,
        message: "Token não informado.",
      });
    }

    const decoded = <any>jwt.verify(token, JWT_SECRET);

    res.locals.user = decoded;

    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusResponse.ERROR,
      message: `Token inválido. ${error}`,
    });
  }
};
