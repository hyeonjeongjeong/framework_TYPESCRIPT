import { IUserDao, jsonToUser, User } from "./user";
import * as fs from 'fs';
import { db_info } from "../../../database/db_info";

const db_type = db_info['db'];
const db_users = db_type.path + db_type.table.user;

export class UserDao implements IUserDao {
    async getAll(): Promise<User[]> {
        let data = fs.readFileSync(db_users, 'utf-8');
        let data_json = JSON.parse(data).users;

        let users:User[] = [];
        
        data_json.forEach((element:any) => {
            users.push(jsonToUser(element));
        });
        
        return users;
    }
    async getById(id: string): Promise<User> {
        try{
            let users = await this.getAll();

            // users를 탐색하며 user_id가 일치하는 것을 찾는다 
            let user:User|undefined = users.find((item:User) => {
                return item.id == id
            });
            
            return user != undefined ? jsonToUser(user) : undefined
        }catch(error){
            console.log(error);
        }

        return undefined;
    }
    async add(user: User): Promise<void> {
        try{
            // users를 가져온다 
           let users = await this.getAll();
           users.push(user);

           fs.writeFileSync(db_users, JSON.stringify({users:users}, null, 4));

        }catch(error){
           console.log(error)
        }

    }
    async modify(user: User): Promise<void> {
        try{
            // users를 가져온다 
            let users = await this.getAll();

            // users에서 user와 같은 아이디를 가진 user의 위치를 찾는다 
            let user_index = users.findIndex((item) => {
                return item.id == user.id;
            })

            // 기존 위치에 새로운 user 덮어씌우기 
            users[user_index] = user;

            // 파일 쓰기
            fs.writeFileSync(db_users, JSON.stringify({users:users}, null, 4));

        }catch(error){
            console.log(error);
        }

    }

}