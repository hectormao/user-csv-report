import "reflect-metadata";
import { Container } from "inversify";
import { UsuarioRepository } from "../repository/usuario.repository";
import { UsuarioService } from "../service/usuario.service";
import TYPES from "../inversify/types";
import { createPool, Pool } from "mariadb";
import { SES } from "aws-sdk";

const container: Container = new Container();
container.bind<UsuarioRepository>(TYPES.Repository).to(UsuarioRepository);
container.bind<UsuarioService>(TYPES.Service).to(UsuarioService);

const pool: Pool = createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "5"),
});

const ses: SES = new SES({ apiVersion: "2010-12-01" });

container.bind<Pool>(TYPES.DBPool).toConstantValue(pool);
container.bind<SES>(TYPES.SES).toConstantValue(ses);

export default container;
