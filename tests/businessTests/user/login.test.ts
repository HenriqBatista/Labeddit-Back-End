import { ZodError } from "zod";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { LoginSchema } from "../../../src/dtos/user/login.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("testes de login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );
  test("login deve gerar um tokenJWT", async () => {
    const input = LoginSchema.parse({
      email: "henrique@email.com",
      password: "henrique123",
    });
    const output = await userBusiness.login(input);
    expect(output).toEqual({
      message: "Login realizado com sucesso.",
      token: "token-mock-henrique",
    });
  });

  test("deve disparar o erro de email inválido do DTO", async () => {
    expect.assertions(1);
    try {
      const input = LoginSchema.parse({
        email: "henrique@emailcom",
        password: "henrique123",
      });
      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "email: Invalid email"
        );
      }
    }
  });

  test("deve disparar o erro de senha inválida do DTO", async () => {
    expect.assertions(1);
    try {
      const input = LoginSchema.parse({
        email: "henrique@email.com",
        password: "h",
      });
      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof ZodError) {
        
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "password: String must contain at least 8 character(s)"
        );
      }
    }
  });

  test("deve disparar o erro de email não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = LoginSchema.parse({
        email: "henrique@eemail.com",
        password: "henrique123"
      });
      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {

        expect(error.message).toBe("'password' ou 'email' incorretos.");

        expect(error.statusCode).toBe(400);
      }
    }
  });
  test("deve disparar o erro de senha incorreta", async () => {
    
    expect.assertions(2);

    try {
      const input = LoginSchema.parse({
        email: "henrique@email.com",
        password: "henrique12",
      });
      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("'password' ou 'email' incorretos.");
        expect(error.statusCode).toBe(400);
      }
    }
  });



});
