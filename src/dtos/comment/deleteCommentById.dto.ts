import {z} from 'zod'

export const DeleteCommentByIdSchema = z.object({
    postId: z.string().min(1),
    commentId: z.string().min(1),
    token: z.string().min(1)
})

export type DeleteCommentByIdInputDTO = z.infer<typeof DeleteCommentByIdSchema>

export const DeleteCommentByIdSchemaOutput = z.object({
    message: z.string().min(1)
})

export type DeleteCommentByIdSchemaOutputDTO = z.infer<typeof DeleteCommentByIdSchemaOutput>