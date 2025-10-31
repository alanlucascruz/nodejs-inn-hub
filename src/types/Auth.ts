import { DefaultResponse } from "./Response";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInContent {
  name: string;
  email: string;
  token: string;
}

export interface SignInResponse extends DefaultResponse {
  content?: SignInContent;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignUpContent {
  name: string;
  email: string;
  token: string;
}

export interface SignUpResponse extends DefaultResponse {
  content?: SignUpContent;
}
