import z from 'zod'

export interface CreatePostInputDTO{
    content: string,
    token: string
}
export const createPostSchema = z.object({
    content: z.string().min(1),
    token: z.string().min(1)
}).transform(data => data as CreatePostInputDTO)


export const CreatePostSchemaOutput = z.object({
    message: z.string().min(1)
})

export type CreatePostOutputDTO = z.infer<typeof CreatePostSchemaOutput>
