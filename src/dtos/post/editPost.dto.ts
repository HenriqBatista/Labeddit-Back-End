import z from 'zod'

export interface EditPostInputDTO {
    content: string,
    token: string,
    id: string
}

export const EditpostOutputschema = z.object({
    message: z.string().min(1)
})

export type EditPostOutputDTO = z.infer<typeof EditpostOutputschema >

export const EdiitPostSchema = z.object({
    content: z.string().min(1),
    token: z.string().min(1),
    id: z.string().min(1)
}).transform(data => data as EditPostInputDTO)