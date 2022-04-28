import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let authenticateUserUseCase : AuthenticateUserUseCase;
let userRepositorioInMemory: InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;

describe ("Authenticate user", ()=>{
    beforeEach(()=>{
        userRepositorioInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositorioInMemory);
        createUserUseCase = new CreateUserUseCase(userRepositorioInMemory);
    });

    it("Should be able to authenticate an user", async ()=>{
        const newUser: ICreateUserDTO = {
            name: "New User",
            email: "newuser@newuser.com",
            password: '123456'
          };
      
        await createUserUseCase.execute(newUser);

        const result = await authenticateUserUseCase.execute({
            email: newUser.email,
            password: newUser.password
        })
        

        expect(result).toHaveProperty("token");


    })
})
