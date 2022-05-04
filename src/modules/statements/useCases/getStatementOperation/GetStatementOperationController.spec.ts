import { hash } from "bcrypt";
import request from "supertest";
import { v4 as uuid } from "uuid";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

describe("GET Statements", () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password )
    values('${id}', 'admin', 'admin@rentx.com.br', '${password}')`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("GET /api/v1/statements/:statement_id", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Marcelo",
      email: "marcelo@test.com",
      password: "1234",
    });
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "marcelo@test.com",
      password: "1234",
    });

    const { user, token } = responseToken.body;

    const statementDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Depositando 200",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    const statementWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Saque de 100",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const resultDeposit = await request(app)
      .get(`/api/v1/statements/${statementDeposit.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });
    const resultWithDraw = await request(app)
      .get(`/api/v1/statements/${statementWithdraw.body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(resultDeposit.body.type).toBe("deposit");
    expect(resultDeposit.body.amount).toBe("200.00");

    expect(resultWithDraw.body.type).toBe("withdraw");
    expect(resultWithDraw.body.amount).toBe("100.00");
  });
});
