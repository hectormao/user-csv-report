import { inject, injectable } from "inversify";
import { Pool } from "mariadb";
import TYPES from "../inversify/types";
import { User } from "../types/types";

@injectable()
class UsuarioRepository {
  constructor(@inject(TYPES.DBPool) private readonly pool: Pool) {}

  public async getUsers(): Promise<User[]> {
    let conn;
    try {
      conn = await this.pool.getConnection();
      const rows = await conn.query("SELECT * from usuarios");
      return rows as User[];
    } finally {
      if (conn) conn.release();
    }
  }
}

export { UsuarioRepository };
