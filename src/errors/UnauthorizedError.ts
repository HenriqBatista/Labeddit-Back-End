import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(
        message: string = "Token Inválido." 
    ) {
        super(401, message)
    }
}