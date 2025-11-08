import { DefaultResBody } from "./Response";

export interface SignInReqBody {
  email: string;
  password: string;
}

export interface SignInContent {
  name: string;
  email: string;
  token: string;
}

export interface SignInResBody extends DefaultResBody {
  content?: SignInContent;
}

export interface SignUpReqBody {
  name: string;
  email: string;
  password: string;
}

export interface SignUpContent {
  name: string;
  email: string;
  token: string;
}

export interface SignUpResBody extends DefaultResBody {
  content?: SignUpContent;
}
