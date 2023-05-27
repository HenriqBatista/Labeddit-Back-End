import { ZodError } from "zod";
import { PostBusiness } from "../../../src/business/PostBusiness";
import { DeletePostSchema } from "../../../src/dtos/post/deletePost.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import exp from "constants";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

describe("testes deletePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar a mensagem de deleção do post", async () => {
    const input = DeletePostSchema.parse({
      idToDelete: "p001",
      token: "token-mock-henrique",
    });

    const output = await postBusiness.deletePost(input);

    expect(output).toEqual({
      message: "Post deletado com sucesso.",
    });
  });

  test("deve disparar o error de idToDelete do DTO", async () => {
    try {
      const input = DeletePostSchema.parse({
        idToDelete: "",
        token: "token-mock-henrique",
      });

      const output = await postBusiness.deletePost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "idToDelete: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve disparar o erro de idToDelete não encontrado", async () => {
    expect.assertions(2)
    try {
      const input = DeletePostSchema.parse({
        idToDelete: "id-invalido",
        token: "token-mock-henrique",
      });

      const output = await postBusiness.deletePost(input);
    } catch (error) {
        if(error instanceof NotFoundError) {
            expect(error.message).toBe("Esse Post não existe.")
            expect(error.statusCode).toBe(404)
        }
    }
  });

  test("deve disparar o erro de token do DTO", async () => {
    expect.assertions(1)
    try {
        const input = DeletePostSchema.parse({
            idToDelete: "p001",
            token: "",
          });
    
          const output = await postBusiness.deletePost(input);
        
    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
        }
    }
  })

  test("deve disparar o erro de token inválido", async () => {
    expect.assertions(2)
    try {
        const input = DeletePostSchema.parse({
            idToDelete: "p001",
            token: "token-mock-invalido",
          });
    
          const output = await postBusiness.deletePost(input);
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            expect(error.message).toBe("Token Inválido.");
            expect(error.statusCode).toBe(401);
        } 
    }
  })

  test("deve disparar o erro de id não permitido para fazer a deleção", async () => {
    expect.assertions(2)
    try {
        const input = DeletePostSchema.parse({
            idToDelete: "p002",
            token: "token-mock-henrique",
          });
    
          const output = await postBusiness.deletePost(input);
        
    } catch (error) {
        if (error instanceof ForbiddenError) {
            expect(error.message).toBe("Somente o criador do Post pode deleta-lo");
            expect(error.statusCode).toBe(403);
        }   
    }
  })
});
