import { Response } from "express";

type TPagination = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type TResponse<T> = {
  statusCode?: number;
  success: boolean;
  message?: string;
  token?: string;
  data?: T;
  meta?: TPagination; // Adjusted to use TPagination type
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode || 500).json({
    success: data.success,
    statusCode: data?.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
    meta: data.meta,
  });
};
export default sendResponse;
