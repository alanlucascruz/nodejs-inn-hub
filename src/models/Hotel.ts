import { model, Schema, Types } from "mongoose";
import { Hotel } from "../types";

const Hotel = new Schema<Hotel>(
  {
    images: [String],
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pool: {
      type: Boolean,
      required: true,
    },
    wifi: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    coffee: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Types.Double,
      required: true,
    },
    reservationDate: Date,
    reservationQuantityDays: Number,
    reserved: {
      type: Boolean,
      required: true,
      default: false,
    },
    reservedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default model<Hotel>("Hotel", Hotel);
