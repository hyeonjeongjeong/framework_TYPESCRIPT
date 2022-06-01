import { ExecutionContext } from "../../context/execution_context";
import { User } from "../../model/user/user";
import { IPolicy, IPolicyResult } from "../policy";

export class Identifier implements IPolicy {

    // resolver를 담아서 보내줌 
    async apply(context: ExecutionContext): Promise<IPolicyResult> {
        
        const req_id = context.req.body.request_id;
        const req_pw = context.req.body.request_pw;
        const userDao = context.userDao;
        let user:User|undefined;

        // id, pw 알아야함 이 클래스를 쓰는쪽이 줘야함 
        try{
            if(req_id == undefined || req_pw == undefined) throw "req not found"
            if(userDao == undefined) throw "userDao not found"
            user = await userDao.getById(req_id);
            
            if(user instanceof User){
                // 비밀번호 불일치 확인 
                return (user.password == req_pw) ? 
                    
                    Promise.resolve({"status": 101, "message": "success", "user": user}) : Promise.reject({"status": 101, "message": "failed_pw"})
                
            }
            
            // user_id로 user도 못찾음 
            return Promise.reject({"status": 101, "message": "failed_id"})
            
        }catch(error){
            console.log(error);
            return Promise.reject({"status": 101, "message": "error"})
        }
        
    }
    
}