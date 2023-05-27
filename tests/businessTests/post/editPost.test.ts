import { ZodError } from "zod";
import { PostBusiness } from "../../../src/business/PostBusiness";
import { EdiitPostSchema } from "../../../src/dtos/post/editPost.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

describe("testes editPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar uma mensagem de confirmação da edição do post", async () => {
    const input = EdiitPostSchema.parse({
      content: "teste de edição",
      id: "p001",
      token: "token-mock-henrique",
    });

    const output = await postBusiness.editPost(input);

    expect(output).toEqual({
      message: "Post editado com sucesso.",
    });
  });

  test("deve retornar o erro de postId do DTO", async () => {
    expect.assertions(1);
    try {
      const input = EdiitPostSchema.parse({
        content: "teste de edição",
        id: "",
        token: "token-mock-henrique",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "id: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve retornar o erro do Id do post não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = EdiitPostSchema.parse({
        content: "teste de edição",
        id: "p005",
        token: "token-mock-henrique",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Esse Post não existe.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("deve disparar o erro de token do DTO", async () => {
    expect.assertions(1);
    try {
      const input = EdiitPostSchema.parse({
        postId: "p001",
        content: "teste de edição",
        token: "",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "token: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve disparar erro de token inválido", async () => {
    expect.assertions(2);
    try {
      const input = EdiitPostSchema.parse({
        id: "p001",
        content: "teste de edição",
        token: "token-mock-invalido",
      });

      const output = await postBusiness.editPost(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token Inválido.");

        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("deve disparar erro de token quando não for admin ou o próprio usuário", async () => {
    expect.assertions(2);
    try {
        const input = EdiitPostSchema.parse({
            id: "p002",
            content: "teste de edição",
            token: "token-mock-henrique",
          });
    
          const output = await postBusiness.editPost(input);
    } catch (error) {
        if (error instanceof ForbiddenError) {
            expect(error.message).toBe("Somente o criador do Post pode editá-lo");
            expect(error.statusCode).toBe(403);
        }
    }
});

test("deve disparar erro de DTO para content", async () => {
    expect.assertions(1);
    try {
        const input = EdiitPostSchema.parse({
            postId: "p001",
            content: "",
            token: "token-mock-larissa",
          });
    
          const output = await postBusiness.editPost(input);
    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("content: String must contain at least 1 character(s)")
        }
    }

});
});
