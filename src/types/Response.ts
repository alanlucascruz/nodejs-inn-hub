import { StatusResponse } from "../utils/enums";

export interface DefaultResponse {
  status?: StatusResponse;
  message?: string;
  content?: any;
}
