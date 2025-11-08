import { Types } from "mongoose";
import { DefaultResponse } from "./Response";

export interface Hotel {
  images?: string[] | null;
  title: string;
  address: string;
  city: string;
  state: string;
  pool: boolean;
  wifi: boolean;
  parking: boolean;
  coffee: boolean;
  price: Types.Double;
  reservationDate?: Date | null;
  reservationQuantityDays?: number | null;
  reserved: boolean;
  reservedBy?: Types.ObjectId | null;
}

export interface HotelDefaultResponse extends DefaultResponse {
  content?: Hotel | null;
}

export interface HotelReadResponse extends DefaultResponse {
  content?: Hotel[] | null;
}

export interface HotelCheckInRequest {
  reservationDate: Date;
  reservationQuantityDays: number;
}
