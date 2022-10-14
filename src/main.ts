import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handler } from "./handler";

const event: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;
const context: Context = {} as Context;

const resultPromise: Promise<APIGatewayProxyResult> = handler(
  event,
  context,
  (error, data) => {}
) as Promise<APIGatewayProxyResult>;

resultPromise.then(
  (result) => console.log(result),
  (error) => console.error(error)
);
