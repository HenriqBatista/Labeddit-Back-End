import {z} from 'zod'

export const GetPostAndCommentByIdSchema = z.object({
    postId: z.string().min(1),
    token: z.string().min(1)
})

export type GetPostAndCommentByIdInputDTO = z.infer<typeof GetPostAndCommentByIdSchema>

export const GetPostAndCommentByIdSchemaOutput = z.object({
    id: z.string(),
    content: z.string(),
    comments: z.number(),
    likes: z.number(),
    dislikes: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    creator: z.object({
        id: z.string(),
        name: z.string()
    }),
    commentsPost: z.array(
        z.object({
            id: z.string(),
            content: z.string(),
            likes: z.number(),
            dislikes: z.number(),
            createdAt: z.string(),
            updatedAt: z.string(),
            creator: z.object({
                id: z.string(), 
                name: z.string()
            })
        }).optional()
    )
})

export type GetPostAndCommentByIdOutputDTO = z.infer<typeof GetPostAndCommentByIdSchemaOutput>
