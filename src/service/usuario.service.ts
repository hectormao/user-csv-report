import { inject, injectable } from "inversify";
import TYPES from "../inversify/types";
import { UsuarioRepository } from "../repository/usuario.repository";
import { User } from "../types/types";
import { SES } from "aws-sdk";
import { SendRawEmailRequest } from "aws-sdk/clients/ses";
const mimemessage = require("mimemessage");
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
    await this.sendCsvEmail(csv);
    return csv;
  }

  private async sendCsvEmail(csv: string) {
    const email: string = process.env.EMAIL as string;
    const fromEmail: string = process.env.FROM_EMAIL as string;
    /*const params: SES.Types.SendEmailRequest = {
      Destination: {
        ToAddresses: [
          email,
      
        ],
      },
      Message: {
      
        Body: {
      
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
      Source: fromEmail ,
      ReplyToAddresses: [
        fromEmail,
      
      ],
    };

    await this.ses.sendEmail(params).promise();*/

    const buff = Buffer.from(csv);

    var text = mimemessage.factory({
      body: "CSV Generado",
    });

    var attachmentEntity = mimemessage.factory({
      contentType: "text/plain",
      contentTransferEncoding: "base64",
      body: buff.toString("base64").replace(/([^**\0**]{76})/g, "$1\n"),
    });
    attachmentEntity.header(
      "Content-Disposition",
      'attachment ;filename="usuarios.csv"'
    );

    const mailContent = mimemessage.factory({
      contentType: "multipart/mixed",
      body: [text, attachmentEntity],
    });

    mailContent.header("From", fromEmail);
    mailContent.header("To", email);
    mailContent.header("Subject", "CSV Generado");

    const params: SendRawEmailRequest = {
      RawMessage: {
        Data: mailContent.toString(),
      },
    };

    await this.ses.sendRawEmail(params).promise();

    console.log("Correo Enviado ...");
  }
}

export { UsuarioService };
