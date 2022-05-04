import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';


describe("Test User Controller", () => {
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

  it("POST /api/v1/users", async ()=>{

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
  });

    const { token } = responseToken.body;

    const response = await request(app).post('/api/v1/users')
      .send({
        name: "Test User",
        email: "test@test.com",
        password: "12345"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);

  })

})
