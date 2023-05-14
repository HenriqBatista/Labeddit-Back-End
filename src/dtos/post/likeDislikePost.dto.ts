import z from 'zod'

export interface LikeDislikePostInputDTO{
    postId: string,
    token: string,
    like: boolean,
}

export type LikeDislikePostOutputDTO = undefined

export const LikeDislikePostSchema = z.object({
    postId: z.string().min(1),
    token: z.string().min(1),
    like: z.boolean(),
}).transform(data => data as LikeDislikePostInputDTO)