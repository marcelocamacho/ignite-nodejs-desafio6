import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "@modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statemanRepositoryInMemory: InMemoryStatementsRepository;
let userRepositoryInMemory: InMemoryUsersRepository;
let autenticateUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let balanceUseCase: GetBalanceUseCase;
let createStatement: CreateStatementUseCase;

describe("Get balance", ()=>{

    beforeEach(()=>{
        userRepositoryInMemory = new InMemoryUsersRepository();
        statemanRepositoryInMemory = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
        autenticateUseCase = new AuthenticateUserUseCase(userRepositoryInMemory);
        balanceUseCase = new GetBalanceUseCase(statemanRepositoryInMemory,userRepositoryInMemory);
        createStatement = new CreateStatementUseCase(userRepositoryInMemory,statemanRepositoryInMemory);
    });

    it("should be able get balance of user", async ()=>{
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

        const result = await balanceUseCase.execute({user_id:user.id})

        expect(result).toHaveProperty("statement")
        expect(result.statement).toBeNull;
        expect(result.balance).toBe(0);


                
        await createStatement.execute({
            user_id: user.id,
            type: DEPOSIT,
            amount: 100,
            description: "deposit",
        })


        const result1 = await balanceUseCase.execute({user_id:user.id})
        expect(result1.statement.length).toBe(1);
        expect(result1.balance).toBe(100);
        


        
    })
})