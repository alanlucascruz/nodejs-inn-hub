import { Types } from "mongoose";
import { DefaultResBody } from "./Response";

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

export interface HotelDefaultResBody extends DefaultResBody {
  content?: Hotel | null;
}

export interface HotelReadResBody extends DefaultResBody {
  content?: Hotel[] | null;
}

export interface HotelFindReqQuery {
  filter: string;
  city: string;
  state: string;
  priceGte: number;
  priceLte: number;
  groupBy: string;
}

export interface HotelCheckInReqBody {
  reservationDate: Date;
  reservationQuantityDays: number;
}
