import { ExecutionContext } from "../../context/execution_context";
import { convertDateFormat } from "../../util/date_util";
import { IPolicy, IPolicyResult } from "../policy";

export class AccountStatus implements IPolicy {
    async apply(context: ExecutionContext): Promise<IPolicyResult> {
        const userDao = context.userDao;
        const req_id = context.req.body.request_id;
        const user = await userDao.getById(req_id);
        
        try{
            if(user == undefined) throw "user not found";
            if(userDao == undefined) throw "userDao not found";
            
            const today = new Date();
            const today_parse = {
                year: today.getFullYear(),
                month: today.getMonth()+1,
                day: today.getDate()
            }
    
            const visit = user?.visit_date.split('-');
            const visit_parse = {
                year: Number(visit[0]),
                month: Number(visit[1]),
                day: Number(visit[2])
            }
    
            const today_Date = new Date(today_parse.year, today_parse.month, today_parse.day)
            const visit_Date = new Date(visit_parse.year, visit_parse.month, visit_parse.day)
    
            // 로그인 한지 30일 지났다면 
            const time_interval = (today_Date.getTime() - visit_Date.getTime())
    
            if(time_interval / (1000 * 60 * 60 * 24 ) > 30) return Promise.reject({"status":103, "message":"failed_dormant"})

            // 휴면계정이 아니라면 
            user.visit_date = convertDateFormat(new Date());
            userDao.modify(user);
        
            return Promise.resolve({"status":103, "message":"success"})
            
        }catch(error){
            return Promise.reject({"status":103, "message":"error"})
        }


    }
}