import { TokenPayload, USER_ROLES } from '../../src/models/User'

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock") {
      return "token-mock"

    } else if (payload.id === "id-mock-henrique") {
      return "token-mock-henrique"

    } else {
      
      return "token-mock-larissa"
    }
  }

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-henrique") {
      return {
        id: "id-mock-henrique",
        name: "henrique",
        role: USER_ROLES.NORMAL
      }

    } else if (token === "token-mock-larissa") {
      return {
        id: "id-mock-larissa",
        name: "larissa",
        role: USER_ROLES.ADMIN
      }

    } else {
      return null
    }
  }
}