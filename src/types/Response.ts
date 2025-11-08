import { Types } from "mongoose";
import { StatusResponse } from "../utils/enums";

export interface DefaultResponse {
  status?: StatusResponse;
  message?: string;
  content?: any;
}

export interface DefaultLocals {
  user: {
    _id: Types.ObjectId;
  };
}
