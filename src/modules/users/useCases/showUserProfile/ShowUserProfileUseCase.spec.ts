import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let authenticateUserUseCase : AuthenticateUserUseCase;
let userRepositorioInMemory: InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;
let showUserProfileUseCase : ShowUserProfileUseCase;

describe ("User Profile", ()=>{
    beforeEach(()=>{
        userRepositorioInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(userRepositorioInMemory);
        createUserUseCase = new CreateUserUseCase(userRepositorioInMemory);
        showUserProfileUseCase = new ShowUserProfileUseCase(userRepositorioInMemory);

    });

    it("Should be able return a user profile", async ()=>{
        const newUser: ICreateUserDTO = {
            name: "New User",
            email: "newuser@newuser.com",
            password: '123456'
          };
      
        await createUserUseCase.execute(newUser);

        const {user,token } = await authenticateUserUseCase.execute({
            email: newUser.email,
            password: newUser.password
        });

        const result = await showUserProfileUseCase.execute(user.id);

        expect(result).toBeInstanceOf(User);
        expect(result.id).toBe(user.id);
        
       
    })
})
