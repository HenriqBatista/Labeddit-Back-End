import z from 'zod'

export interface DeletePostInputDTO{
    token: string,
    idToDelete: string
}


export const deletePostOutputSchema = z.object({
    message: z.string().min(1)
})

export type DeletePostOutputDTO = z.infer<typeof deletePostOutputSchema>


export const DeletePostSchema = z.object({
    token: z.string().min(1),
    idToDelete: z.string().min(1)
}).transform(data => data as DeletePostInputDTO)