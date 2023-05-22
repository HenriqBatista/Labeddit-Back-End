import {z} from 'zod'

export const EditCommentSchema = z.object({
    postId: z.string().min(1),
    commentId: z.string().min(1),
    content: z.string().min(1),
    token: z.string().min(1)
})

export type EditCommentInputDTO = z.infer<typeof EditCommentSchema>

export const EditCommentSchemaOutput = z.object({
    message: z.string().min(1)
})

export type EditCommentOutputDTO = z.infer<typeof EditCommentSchemaOutput>