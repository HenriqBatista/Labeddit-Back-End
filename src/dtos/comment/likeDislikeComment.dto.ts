import {z} from 'zod'

export const LikeDislikeCommentSchema = z.object({
    postId: z.string().min(1),
    commentId: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean()
})

export type LikeDislikeCommentInputDTO = z.infer<typeof LikeDislikeCommentSchema>

export type LikeDislikeCommentOutputDTO = undefined