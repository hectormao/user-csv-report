import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { handler } from "./handler";

const event: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;
const context: Context = {} as Context;

const resultPromise: Promise<any> = handler(event, context) as Promise<any>;

resultPromise.then(
  (result) => console.log(result),
  (error) => console.error(error)
);
