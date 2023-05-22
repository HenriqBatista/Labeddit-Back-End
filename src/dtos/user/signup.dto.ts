import z from "zod"

export interface SignupInputDTO {
  // id: string,
  name: string,
  email: string,
  password: string
}

export interface SignupOutputDTO {
  message: string,
  token: string
}

export const SignupSchema = z.object({
  // id: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(2)
}).transform(data => data as SignupInputDTO)


// id foi retirado da interface input e da validação pois esta sendo criado com UUID