import { hash } from 'bcrypt';
import request from 'supertest';
import { v4 as uuid } from 'uuid';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';
import { User } from '@modules/users/entities/User';


describe("Test User Profile Controller", () => {
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

  it("GET /api/v1/profile", async ()=>{

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
  });

    const {user, token } = responseToken.body;


    const response = await request(app).get('/api/v1/profile')
      .send({
       id: user.id
      })
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.statusCode).toBe(200);
  })
})
