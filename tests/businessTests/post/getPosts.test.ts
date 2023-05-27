import { ZodError } from "zod";
import { PostBusiness } from "../../../src/business/PostBusiness";
import { getPostSchema } from "../../../src/dtos/post/getPosts.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";

// export interface PostModel{
//     id: string;
//     content: string;
//     comments: number;
//     likes: number;
//     dislikes: number;
//     createdAt: string;
//     updatedAt: string
//     creator:{
//         id:string,
//         name:string
//     }
// }

describe("testes de getPosts", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("deve retornar um lista com todos os posts", async () => {
    const input = getPostSchema.parse({
      token: "token-mock-henrique",
    });
    const output = await postBusiness.getPosts(input);

    expect(output).toHaveLength(3);
    expect(output).toEqual([
      {
        id: "p001",
        content: "post 1",
        comments: 0,
        likes: 0,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
            id: "id-mock-henrique",
            name:"henrique"
        }
      },
      {
        id: "p002",
        content: "post 2",
        comments: 0,
        likes: 0,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
            id: "id-mock-larissa",
            name:"larissa"
        }
      },
      {
        id: "p003",
        content: "post 3",
        comments: 0,
        likes: 0,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
            id: "id-mock-henrique",
            name:"henrique"
        }
      }
    ]);
  });

  test("deve retornar o erro de token do DTO", async ()=>{
    expect.assertions(1);
    try {
        const input = getPostSchema.parse({
            token: "",
        });
      
        const output = await postBusiness.getPosts(input);

    } catch (error) {
        if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
        }
    }
  })

  test("deve disparar erro de token inválido", async () => {
    expect.assertions(2);
    try {
      const input = getPostSchema.parse({
      token: "token-mock-invalido",
    });

    const output = await postBusiness.getPosts(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {

        expect(error.message).toBe("Token Inválido.");

        expect(error.statusCode).toBe(401);
      }
    }
  });


});
