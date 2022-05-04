import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let autenticateUseCase: AuthenticateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe(" Test statement", () => {

  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    autenticateUseCase = new AuthenticateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository,statementsRepository)

  })

  it("should be able get statements", async ()=>{
    const newUser:ICreateUserDTO = {
        name: "Marcelo",
        email: "marcelocamacho.ufpa@gmail.com",
        password: "1234"
    };

    const user = await createUserUseCase.execute(newUser);
    const {token} = await autenticateUseCase.execute({
        email: newUser.email,
        password: newUser.password
    });


    await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "deposit",
    })

    const {id,user_id} = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "deposit",
  })

   const result = await getStatementOperationUseCase.execute({
     user_id,
     statement_id: id
    })

    expect(result.id).toBe(id);
    expect(result.amount).toBe(50);
    expect(result.type).toBe('withdraw');
})
})
