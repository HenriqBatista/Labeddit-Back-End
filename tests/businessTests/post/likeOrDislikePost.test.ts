import { ZodError } from "zod";
import { PostBusiness } from "../../../src/business/PostBusiness";
import { LikeDislikePostSchema } from "../../../src/dtos/post/likeDislikePost.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import exp from "constants";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";

describe("testes likeOrDislikePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("retorno da função deve ser undefined ao dar like", async () => {
    const input = LikeDislikePostSchema.parse({
      postId: "p003",
      token: "token-mock-henrique",
      like: true,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toBeUndefined();
  });

  test("retorno da função deve ser undefined ao dar dislike", async () => {
    const input = LikeDislikePostSchema.parse({
      postId: "p001",
      token: "token-mock-larissa",
      like: false,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toBeUndefined();
  });

  test("retorno da função deve ser undefined ao sobrescrever um dislike com like", async () => {
    const input = LikeDislikePostSchema.parse({
      postId: "p001",
      token: "token-mock-larissa",
      like: true,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toBeUndefined();
  });

  test("retorno da função deve ser undefined ao sobrescrever um like com dislike", async () => {
    const input = LikeDislikePostSchema.parse({
      postId: "p002",
      token: "token-mock-henrique",
      like: false,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toBeUndefined();
  });

  test("retorno da função deve ser undefined ao sobrescrever um like com like", async () => {
    const input = LikeDislikePostSchema.parse({
      postId: "p002",
      token: "token-mock-henrique",
      like: true,
    });

    const output = await postBusiness.likeOrDislikePost(input);

    expect(output).toBeUndefined();
  });

  test("deve disparar o erro de postId do DTO", async () => {
    expect.assertions(1);
    try {
      const input = LikeDislikePostSchema.parse({
        postId: "",
        token: "token-mock-henrique",
        like: false,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe(
          "postId: String must contain at least 1 character(s)"
        );
      }
    }
  });

  test("deve disparar o erro de postId não encontrado", async () => {
    expect.assertions(2);
    try {
      const input = LikeDislikePostSchema.parse({
        postId: "id-invalido",
        token: "token-mock-henrique",
        like: false,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
        if(error instanceof NotFoundError) {
            expect(error.message).toBe("Post não encontrado.")
            expect(error.statusCode).toBe(404)
        }
    }
  });

  test("deve disparar o erro de token do DTO", async () => {
    expect.assertions(1);
    try {
        const input =  LikeDislikePostSchema.parse({
            postId: "p001",
            token: "",
            like: true
        });
    
        const output = await postBusiness.likeOrDislikePost(input)

    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
        }
    }
});

test("deve disparar o erro de token inválido", async () => {
    expect.assertions(2);
    try {
      const input = LikeDislikePostSchema.parse({
        postId: "p001",
        token: "token-mock-invalido",
        like: false,
      });

      const output = await postBusiness.likeOrDislikePost(input);
    } catch (error) {
        if(error instanceof UnauthorizedError) {
            expect(error.message).toBe("Token Inválido.")
            expect(error.statusCode).toBe(401)
        }
    }
  });

  
});
