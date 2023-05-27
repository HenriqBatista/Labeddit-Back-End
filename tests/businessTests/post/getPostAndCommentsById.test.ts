import { ZodError } from "zod";
import { PostBusiness } from "../../../src/business/PostBusiness";
import { GetPostAndCommentByIdSchema } from "../../../src/dtos/post/getPostAndCommentById.dto";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";


describe('testes de getPostAndCommentsById',()=>{
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
      );

      test("deve retornar o post e comentários feito neles, de acordo com o id do input", async ()=>{
        const input = GetPostAndCommentByIdSchema.parse({
            postId :"p001",
            token: "token-mock-larissa"
        })

        const output = await postBusiness.getPostAndCommentsById(input)
        expect(output).toEqual(
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
                },
                commentsPost:[
                    {
                        id: "c001",
                        content: "comentário 1",
                        likes: 0,
                        dislikes: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        creator:{
                            id: "id-mock-larissa",
                            name: "larissa",
                        },
                      },
                      {
                        id: "c002",
                        content: "comentário 2",
                        likes: 0,
                        dislikes: 0,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        creator:{
                            id: "id-mock-henrique",
                            name: "henrique"
                        },
                      },
                ]
            }
            
          )
      })

      test("deve disparar erro de token do DTO", async () => {
        expect.assertions(1);
        try {
            const input = GetPostAndCommentByIdSchema.parse({
                postId: "p001",
                token: "",
            });
        
            const output = await postBusiness.getPostAndCommentsById(input)
            

        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)");
            }
        }
    });

      test("deve disparar erro de token inválido", async () => {
        expect.assertions(2);
        try {
            const input = GetPostAndCommentByIdSchema.parse({
                postId: "p001",
                token: "token-mock-invalido",
            });
        
            const output = await postBusiness.getPostAndCommentsById(input)
            

        } catch (error) {
            if (error instanceof UnauthorizedError) {
                expect(error.message).toBe("Token Inválido.");
                expect(error.statusCode).toBe(401)
            }
        }
    });

    test("deve disparar erro de postId do DTO", async () => {
        expect.assertions(1);
        try {
            const input = GetPostAndCommentByIdSchema.parse({
                postId: "",
                token: "token-mock",
            });
        
            const output = await postBusiness.getPostAndCommentsById(input)

        } catch (error) {
            if (error instanceof ZodError) {
                expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("postId: String must contain at least 1 character(s)");
            }
        }
    });

    test("deve disparar erro de postId inválido", async () => {
        expect.assertions(2);
        try {
            const input = GetPostAndCommentByIdSchema.parse({
                postId: "post invalido",
                token: "token-mock-henrique",
            });
        
            const output = await postBusiness.getPostAndCommentsById(input)
            

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("Post não encontrado.");
                expect(error.statusCode).toBe(404)
            }
        }
    });

      
})