import { UserBusiness } from "../../../src/business/UserBusiness";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { USER_ROLES } from "../../../src/models/User";
import { ZodError } from "zod";
import { GetUsersSchema } from "../../../src/dtos/user/getUsers.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

describe("Testes do metodo getUsers", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve retornar a lista de usuários sem a senha", async () => {
    const input = GetUsersSchema.parse({
      token: "token-mock-larissa",
    });
    const output = await userBusiness.getUsers(input);

    expect(output).toEqual([
      {
        id: "id-mock-henrique",
        name: "henrique",
        email: "henrique@email.com",
        createdAt: expect.any(String),
        role: USER_ROLES.NORMAL,
      },
      {
        id: "id-mock-larissa",
        name: "larissa",
        email: "larissa@email.com",
        createdAt: expect.any(String),
        role: USER_ROLES.ADMIN,
      },
    ]);
  });

  test("deve disparar erro para a falta token", async () => {
   
    expect.assertions(1);
    try {
      const input = GetUsersSchema.parse({
        token: "",
      });

      const output = await userBusiness.getUsers(input);

    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
        }
    }
  });

  test("deve disparar erro de token inválido", async () => {
    
    expect.assertions(2);

    try {
      const input = GetUsersSchema.parse({
        token: "token-mock-invalido",
      });

      const output = await userBusiness.getUsers(input);
      console.log(UnauthorizedError)
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido.");

        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("deve disparar erro de token quando não for admin", async () => {
    expect.assertions(2);

    try {
      const input = GetUsersSchema.parse({
        token: "token-mock-henrique",
      });

      const output = await userBusiness.getUsers(input);
      console.log(ForbiddenError)
    } catch (error) {
      if (error instanceof ForbiddenError) {

        expect(error.message).toBe("Acesso negado. Você não tem permissão para acessar esse conteúdo.");

        expect(error.statusCode).toBe(403);
      }
    }
  });
});
