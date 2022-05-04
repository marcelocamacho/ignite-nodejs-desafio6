import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';


describe("TEST AUTHENTICATE", () => {
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

  it("POST /api/v1/session", async ()=>{

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
  });

    const { token } = responseToken.body;

     await request(app).post('/api/v1/users')
      .send({
        name: "Test User",
        email: "test@test.com",
        password: "12345"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      const response = await request(app).post('/api/v1/sessions').send({
        email: "test@test.com",
        password: '12345',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token')

  })

})
