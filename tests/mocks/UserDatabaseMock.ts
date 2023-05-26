import {USER_ROLES, UserDB} from '../../src/models/User'
import {BaseDatabase} from '../../src/database/BaseDatabase';


export const usersMock: UserDB[] = [
    {
        id: "id-mock-henrique",
        name: "henrique",
        email: "henrique@email.com", 
        password: "hash-mock-henrique", // senha = "henrique123"
        created_at: new Date().toISOString(),
        role: USER_ROLES.NORMAL
    },
    {
        id: "id-mock-larissa",
        name: "larissa",
        email: "larissa@email.com",
        password: "hash-mock-larissa", // senha = "larissa123"
        created_at: new Date().toISOString(),
        role: USER_ROLES.ADMIN
    },
]

export class UserDatabaseMock extends BaseDatabase {

    public async findUsers(q: string | undefined): Promise<UserDB[]> {
        if (q) {
            return usersMock.filter(user =>
                user.name.toLocaleLowerCase().includes(q.toLocaleLowerCase())
            )
        } else {
            return usersMock
        }
    }

    public async findUserById(id: string): Promise<UserDB | undefined> {
        return usersMock.filter(user => user.id === id)[0]
    }


    public async findUserByEmail(email: string): Promise<UserDB | undefined> {
        return usersMock.filter(user => user.email === email)[0]
    }

    public async insertUser(newUserDB: UserDB): Promise<void> {
        
    }

}