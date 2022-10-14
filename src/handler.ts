import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import * as httpStatus from "http-status";

import container from "./inversify/inversify.config";
import TYPES from "./inversify/types";
import { UsuarioService } from "./service/usuario.service";
import { User } from "./types/types";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const service: UsuarioService = container.get(TYPES.Service);

  const result: string = await service.processUsers();

  return {
    statusCode: httpStatus.OK,
    body: result,
  } as APIGatewayProxyResult;
};
