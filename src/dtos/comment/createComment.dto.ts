import {z} from 'zod'

export const CreateCommentSchema = z.object({
    postId: z.string().min(1),
    content: z.string().min(1),
    token:z.string().min(1)
})

export type CreateCommentInputDTO = z.infer<typeof CreateCommentSchema>

export const CreateCommentSchemaOutput = z.object({
    message: z.string().min(1)
})

export type CreateCommentOutputDTO = z.infer<typeof CreateCommentSchemaOutput>