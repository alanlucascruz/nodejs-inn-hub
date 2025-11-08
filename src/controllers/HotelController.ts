import { Double, HydratedDocument as Hydrated } from "mongoose";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { StatusResponse } from "../utils/enums";
import HotelModel from "../models/Hotel";
import {
  Hotel,
  HotelReadResBody,
  HotelDefaultResBody,
  HotelCheckInReqBody,
  IdReqParams,
  DefaultLocals,
  DefaultResBody,
  HotelFindReqQuery,
} from "../types";

export const read = async (req: Request, res: Response<HotelReadResBody>) => {
  try {
    const data: Hydrated<Hotel>[] | null = await HotelModel.find()
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

export const find = async (
  req: Request<{}, {}, {}, HotelFindReqQuery>,
  res: Response<HotelReadResBody>
) => {
  try {
    const { filter, city, state, priceGte, priceLte, groupBy } = req.query;

    const query = HotelModel.find()
      .or([
        { title: new RegExp(filter, "i") },
        { address: new RegExp(filter, "i") },
      ])
      .where({ city: new RegExp(city, "i") })
      .where({ state: new RegExp(state, "i") })
      .populate("reservedBy")
      .sort({ createdAt: "desc" });

    if (priceGte) {
      query.where({ price: { $gte: priceGte } });
    }

    if (priceLte) {
      query.where({ price: { $lte: priceLte } });
    }

    const data: Hydrated<Hotel>[] = await query.exec();

    res
      .status(StatusCodes.OK)
      .json({ status: StatusResponse.OK, content: data });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao filtrar. ${error}`,
    });
  }
};

export const findById = async (
  req: Request<IdReqParams>,
  res: Response<HotelDefaultResBody>
) => {
  try {
    const { id }: IdReqParams = req.params;

    const data: Hydrated<Hotel> | null = await HotelModel.findById(id).populate(
      "reservedBy"
    );

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
  req: Request<{}, {}, Hotel>,
  res: Response<HotelDefaultResBody>
) => {
  try {
    const data: Hotel = req.body;

    const newData: Hydrated<Hotel> = await HotelModel.create(data);

    const populatedData: Hydrated<Hotel> | null = await HotelModel.findById(
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
  req: Request<IdReqParams, {}, Hotel>,
  res: Response<HotelDefaultResBody>
) => {
  try {
    const { id }: IdReqParams = req.params;

    const data: Hotel = req.body;

    const updatedData: Hydrated<Hotel> | null =
      await HotelModel.findByIdAndUpdate(id, data, {
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
  req: Request<IdReqParams, {}, HotelCheckInReqBody>,
  res: Response<HotelDefaultResBody, DefaultLocals>
) => {
  try {
    const { id }: IdReqParams = req.params;
    const data: HotelCheckInReqBody = req.body;
    const { user }: DefaultLocals = res.locals;

    const hotel: Hydrated<Hotel> | null = await HotelModel.findById(id);

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

    const populatedData: Hydrated<Hotel> | null = await HotelModel.findById(
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
  req: Request<IdReqParams>,
  res: Response<HotelDefaultResBody>
) => {
  try {
    const { id }: IdReqParams = req.params;

    const hotel: Hydrated<Hotel> | null = await HotelModel.findById(id);

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

    const populatedData: Hydrated<Hotel> | null = await HotelModel.findById(
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
  req: Request<IdReqParams>,
  res: Response<DefaultResBody>
) => {
  try {
    const { id }: IdReqParams = req.params;

    const data: Hotel | null = await HotelModel.findById(id);

    if (data?.reserved) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusResponse.ERROR,
        message: `O hotel "${data.title}" está reservado e portanto não pode ser excluído.`,
      });
    }

    await HotelModel.findByIdAndDelete(id);

    res.status(StatusCodes.NO_CONTENT).end();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusResponse.ERROR,
      message: `Erro ao excluir. ${error}`,
    });
  }
};
