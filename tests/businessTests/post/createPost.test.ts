import { ZodError } from 'zod';
import {PostBusiness} from '../../../src/business/PostBusiness';
import { createPostSchema } from '../../../src/dtos/post/createPost.dto';
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock';
import { PostDatabaseMock } from '../../mocks/PostDatabaseMock';
import { TokenManagerMock } from '../../mocks/TokenManagerMock';
import { UserDatabaseMock } from '../../mocks/UserDatabaseMock';
import { UnauthorizedError } from '../../../src/errors/UnauthorizedError';

describe("testes createPost",()=>{
    const postBusiness = new PostBusiness(
        new  PostDatabaseMock(),
        new  UserDatabaseMock(),
        new  IdGeneratorMock(),
        new  TokenManagerMock()
    )
    
    test("deve retorna mensagem de post criado com sucesso", async () => {
        const input = createPostSchema.parse({
          content: "teste de um post",
          token: "token-mock-henrique"
        })
    
        const output = await postBusiness.createPost(input)
    
        expect(output).toEqual({
          message: "Post criado com sucesso!"
        })
      })

      test("deve disparar o erro de content do DTO", async () => {
        expect.assertions(1);
        try {
          const input = createPostSchema.parse({
              content: "",
              token: "token-mock-henrique"
          });
    
          const output = await postBusiness.createPost(input)
    
        } catch (error) {
          if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("content: String must contain at least 1 character(s)")
          }
        }
      });

      test("deve disparar o erro de token do DTO", async () => {
        expect.assertions(1);
        try {
          const input = createPostSchema.parse({
              content: "teste de um post",
              token: ""
          });
    
          const output = await postBusiness.createPost(input)
    
        } catch (error) {
          if (error instanceof ZodError) {
            expect(`${error.issues[0].path[0]}: ${error.issues[0].message}`).toBe("token: String must contain at least 1 character(s)")
          }
        }
      });

      test("deve disparar o erro de token do DTO", async () => {
        expect.assertions(2);
        try {
          const input = createPostSchema.parse({
              content: "teste de um post",
              token: "token-mock-invalido"
          });
    
          const output = await postBusiness.createPost(input)
    
        } catch (error) {
          if (error instanceof UnauthorizedError) {
            expect(error.message).toBe("Token Inválido.")
            expect(error.statusCode).toBe(401)
          }
        }
      });

})