import { inject, injectable } from "inversify";
import TYPES from "../inversify/types";
import { UsuarioRepository } from "../repository/usuario.repository";
import { User } from "../types/types";
import { SES } from "aws-sdk";
const { Parser } = require("json2csv");

@injectable()
class UsuarioService {
  constructor(
    @inject(TYPES.Repository) private readonly repository: UsuarioRepository,
    @inject(TYPES.SES) private readonly ses: SES
  ) {}

  public async processUsers(): Promise<string> {
    const users: User[] = await this.repository.getUsers();
    const parser = new Parser({
      fields: ["id", "usuario", "email", "sexo", "ciudad", "fecha"],
    });
    const csv = parser.parse(users);
    return csv;
  }

  private async sendCsvEmail(csv: string) {
    const params: SES.Types.SendEmailRequest = {
      Destination: {
        ToAddresses: [
          process.env.EMAIL,
          /* more items */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Text: {
            Charset: "UTF-8",
            Data: "Correo del CSV",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "CSV Generado",
        },
      },
      Source: "hectormao.gonzalez@gmail.com" /* required */,
      ReplyToAddresses: [
        "hectormao.gonzalez@gmail.com",
        /* more items */
      ],
    };

    await this.ses.sendEmail(params).promise();
    console.log("Correo Enviado ...");
  }
}

export { UsuarioService };
