import { HydratedDocument } from "mongoose";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { StatusResponse } from "../utils/enums";
import Hotel from "../models/Hotel";
import {
  Hotel as IHotel,
  HotelReadResponse,
  HotelDefaultResponse,
  HotelCheckInRequest,
  IdRequest,
  DefaultLocals,
  DefaultResponse,
} from "../types";

export const read = async (req: Request, res: Response<HotelReadResponse>) => {
  try {
    const data: HydratedDocument<IHotel>[] | null = await Hotel.find({})
      .populate("reservedBy")
      .sort({ createdAt: "desc" });

    res
      .status(StatusCodes.OK)
      .json({ status: StatusResponse.OK, content: data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao listar. ${error}`,
    });
  }
};

export const find = async () => {};

export const findById = async (
  req: Request<IdRequest>,
  res: Response<HotelDefaultResponse>
) => {
  try {
    const { id }: IdRequest = req.params;

    const data: HydratedDocument<IHotel> | null = await Hotel.findById(
      id
    ).populate("reservedBy");

    res
      .status(StatusCodes.OK)
      .json({ status: StatusResponse.OK, content: data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao buscar. ${error}`,
    });
  }
};

export const create = async (
  req: Request<{}, {}, IHotel>,
  res: Response<HotelDefaultResponse>
) => {
  try {
    const data: IHotel = req.body;

    const newData: HydratedDocument<IHotel> = await Hotel.create(data);

    const populatedData: HydratedDocument<IHotel> | null = await Hotel.findById(
      newData._id
    ).populate("reservedBy");

    res
      .status(StatusCodes.CREATED)
      .json({ status: StatusResponse.OK, content: populatedData });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao cadastrar. ${error}`,
    });
  }
};

export const update = async (
  req: Request<IdRequest, {}, IHotel>,
  res: Response<HotelDefaultResponse>
) => {
  try {
    const { id }: IdRequest = req.params;

    const data: IHotel = req.body;

    const updatedData: HydratedDocument<IHotel> | null =
      await Hotel.findByIdAndUpdate(id, data, {
        returnDocument: "after",
      }).populate("reservedBy");

    res
      .status(StatusCodes.OK)
      .json({ status: StatusResponse.OK, content: updatedData });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao cadastrar. ${error}`,
    });
  }
};

export const checkIn = async (
  req: Request<IdRequest, {}, HotelCheckInRequest>,
  res: Response<HotelDefaultResponse, DefaultLocals>
) => {
  try {
    const { id }: IdRequest = req.params;
    const data: HotelCheckInRequest = req.body;
    const { user }: DefaultLocals = res.locals;

    const hotel: HydratedDocument<IHotel> | null = await Hotel.findById(id);

    if (!hotel) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusResponse.ERROR,
        message: "Hotel não encontrado.",
      });
    }

    if (hotel.reserved) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusResponse.ERROR,
        message: "O hotel está reservado.",
      });
    }

    hotel.reservationDate = data.reservationDate;
    hotel.reservationQuantityDays = data.reservationQuantityDays;
    hotel.reserved = true;
    hotel.reservedBy = user._id;

    await hotel.save();

    const populatedData: HydratedDocument<IHotel> | null = await Hotel.findById(
      id
    ).populate("reservedBy");

    res.status(StatusCodes.OK).json({
      status: StatusResponse.OK,
      message: "Reserva efetuada!",
      content: populatedData,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao fazer Check-in. ${error}`,
    });
  }
};

export const checkOut = async (
  req: Request<IdRequest>,
  res: Response<HotelDefaultResponse>
) => {
  try {
    const { id }: IdRequest = req.params;

    const hotel: HydratedDocument<IHotel> | null = await Hotel.findById(id);

    if (!hotel) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusResponse.ERROR,
        message: "Hotel não encontrado.",
      });
    }

    hotel.reservationDate = null;
    hotel.reservationQuantityDays = null;
    hotel.reserved = false;
    hotel.reservedBy = null;

    await hotel.save();

    const populatedData: HydratedDocument<IHotel> | null = await Hotel.findById(
      id
    ).populate("reservedBy");

    res.status(StatusCodes.OK).json({
      status: StatusResponse.OK,
      message: "Check-out efetuado!",
      content: populatedData,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao fazer Check-out. ${error}`,
    });
  }
};

export const remove = async (
  req: Request<IdRequest>,
  res: Response<DefaultResponse>
) => {
  try {
    const { id }: IdRequest = req.params;

    const data: IHotel | null = await Hotel.findById(id);

    if (data?.reserved) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusResponse.ERROR,
        message: `O hotel "${data.title}" está reservado e portanto não pode ser excluído.`,
      });
    }

    await Hotel.findByIdAndDelete(id);

    res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao excluir. ${error}`,
    });
  }
};
