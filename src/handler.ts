import { APIGatewayProxyResult, Context } from "aws-lambda";

import * as httpStatus from "http-status";
import { Container } from "inversify";

import getContainer from "./inversify/inversify.config";
import TYPES from "./inversify/types";
import { UsuarioService } from "./service/usuario.service";

let containerPromise: Promise<Container>;

export const handler = async (event: any, context: Context): Promise<any> => {
  if (containerPromise == null) {
    containerPromise = getContainer();
  }
  const container: Container = await containerPromise;

  const service: UsuarioService = container.get(TYPES.Service);

  const result: string = await service.processUsers();

  return {
    statusCode: httpStatus.OK,
    body: result,
  } as APIGatewayProxyResult;
};
