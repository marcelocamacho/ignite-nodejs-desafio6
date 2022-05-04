import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';


describe("Test Balance", () => {
  let connection: Connection;
  beforeAll(async ()=>{
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('admin', 8);

    await connection.query(
        `INSERT INTO USERS(id, name, email, password )
    values('${id}', 'admin', 'admin@rentx.com.br', '${password}')`
    );
  });

  afterAll(async ()=>{
    await connection.dropDatabase();
    await connection.close();
  });

  it("GET /api/v1/statements/balance", async ()=>{
    await request(app).post('/api/v1/users')
    .send({
        name: "Marcelo",
        email: "marcelo@test.com",
        password: "1234"
      });


    const responseToken = await request(app).post('/api/v1/sessions')
        .send({
          email: "marcelo@test.com",
          password: "1234",
        });
    const {user, token } = responseToken.body;

    const result = await request(app).get('/api/v1/statements/balance')
        .send({
          id: user.id
        }).set({
          Authorization: `Bearer ${token}`,
        });

    expect(result.body).toHaveProperty('statement');
    expect(result.body).toHaveProperty('balance');
    expect(result.body.balance).toBe(0);
  });

})
