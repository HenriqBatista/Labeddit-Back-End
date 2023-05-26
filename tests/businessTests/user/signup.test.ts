import { ZodError } from "zod";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("testes de signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar um token ao cadastrar", async () => {
    const input = SignupSchema.parse({
      name: "teste",
      email: "teste@email.com",
      password: "teste123",
    });
    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      message: "Cadastro realizado com sucesso.",
      token: "token-mock",
    });
  });

  test("deve disparar o erro de 'Name' do DTO", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "",
        email: "teste@email.com",
        password: "teste123",
      });
      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "name: String must contain at least 2 character(s)"
        );
      }
    }
  });

  test("deve disparar o erro de 'Email' do DTO", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "teste",
        email: "teste@email..com",
        password: "teste123",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "email: Invalid email"
        );
      }
    }
  });

  test("deve disparar o erro de 'Password' do DTO, deve ter pelo menos 8 caracteres", async () => {
    expect.assertions(1);
    try {
      const input = SignupSchema.parse({
        name: "teste",
        email: "teste@email.com",
        password: "test123",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
        if (error instanceof ZodError) {
        
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
              "password: String must contain at least 8 character(s)"
            );
          }
    }
  });
});
