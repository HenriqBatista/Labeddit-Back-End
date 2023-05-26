export class HashManagerMock {
    public hash = async (
      plaintext: string
    ): Promise<string> => {
      return "hash-mock"
    }

    public compare = async (
      plaintext: string,
      hash: string
    ): Promise<boolean> => {
      switch(plaintext) {
        case "henrique123":
          return hash === "hash-mock-henrique"

        case "larissa123":
          return hash === "hash-mock-larissa"

        case "erick123":
          return hash === "hash-mock-erick"
          
        default:
          return false
      }
    }
}