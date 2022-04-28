import { User } from '@modules/users/entities/User';
import {InMemoryUsersRepository} from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';
import { ICreateUserDTO } from './ICreateUserDTO';

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create user", ()=>{
  beforeEach(()=>{
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("Should be able to create a new user", async ()=>{
    const newUser: ICreateUserDTO = {
      name: "New User",
      email: "newuser@newuser.com",
      password: '123456'
    };

    const result = await createUserUseCase.execute(newUser);

    expect(result).toHaveProperty("id")
    expect(result.name).toBe("New User")
    expect(result).toBeInstanceOf(User);


  })
})
