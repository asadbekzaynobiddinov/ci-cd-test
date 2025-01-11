import { IResponseMessage } from './response.message';
import { Response } from 'express';

export const responseHandler = (result: IResponseMessage, res: Response) => {
  if (!result.success) {
    return res.status(result.status).send(result.message);
  }
  return res.status(result.status).send(result.message);
};
