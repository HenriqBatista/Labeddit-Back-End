import { UserDatabase } from "../database/UserDatabase";
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/getUsers.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager, TokenPayload } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager : HashManager
  ) {}

  public getUsers = async (
    input: GetUsersInputDTO
  ): Promise<GetUsersOutputDTO> => {
    const { q, token } = input;
    const payload = this.tokenManager.getPayload(token);

    if(payload === null){
      throw new NotFoundError("Token inválido.")
    }
    if(payload.role !== USER_ROLES.ADMIN){
      throw new BadRequestError("Apenas Pessoas Admins podem acessar a lista de todos os usuários.")
    }

    const usersDB = await this.userDatabase.findUsers(q);

    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      );

        return user.toBusinessModel()
    });

    const output: GetUsersOutputDTO = users
    return output
  };

  public signup = async (
    input: SignupInputDTO
  ):Promise<SignupOutputDTO>=>{
    const {name, email, password} = input;

    const id = this.idGenerator.generate();

    const hashedPassword = await this.hashManager.hash(password);


    const newUser = new User(
        id,
        name,
        email,
        hashedPassword,
        USER_ROLES.NORMAL,
        new Date().toISOString(),
    )
    
    const newUserDB = newUser.toDBModel()
    await this.userDatabase.insertUser(newUserDB);
    
    const TokenPayload: TokenPayload = {
        id: newUser.getId(),
        name: newUser.getName(),
        role: newUser.getRole()
    }
    const token = this.tokenManager.createToken(TokenPayload)

    const output: SignupOutputDTO = {
        message: "Cadastro realizado com sucesso.",
        token
    }
    return output

  }

  public login = async (
    input: LoginInputDTO
  ): Promise<LoginOutputDTO> => {
    const { email, password } = input

    const userDB = await this.userDatabase.findUserByEmail(email)

    if (!userDB) {
      throw new NotFoundError("'email' não encontrado")
    }

    const correctPassword = await this.hashManager.compare(password, userDB.password)
    if(!correctPassword) {
      throw new BadRequestError("'password' ou 'email' incorretos.")
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    )

    const tokenPayload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    }
    const token = this.tokenManager.createToken(tokenPayload)

    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token: token
    }

    return output
  }

}
