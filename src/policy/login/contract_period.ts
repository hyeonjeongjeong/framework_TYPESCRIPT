import { ExecutionContext } from "../../context/execution_context";
import { allowComCode } from "../../decorator";
import { Company } from "../../model/company/company";
import { IPolicy, IPolicyResult } from "../policy";


@allowComCode(["80000"]) //80000번인 회사코드는 정책 pass => 계약기간 안봄 
export class ContractPeriod implements IPolicy {

    async apply(context: ExecutionContext): Promise<IPolicyResult> {
        
        const req_id = context.req.body.request_id;
        const user = await context.userDao.getById(req_id);
        let company:Company;
        if(user !== undefined) company = user.company;

        try{
            if(company == undefined) throw "company not found"
            const today = new Date();
            
            const today_parse = {
                year: today.getFullYear(),
                month: today.getMonth()+1,
                day: today.getDate()
            }
    
            const expire = company.expire_date.split('-');
            const expire_parse = {
                year: Number(expire[0]),
                month: Number(expire[1]),
                day: Number(expire[2])
            }
    
            const today_Date = new Date(today_parse.year, today_parse.month, today_parse.day);
            const expire_Date = new Date(expire_parse.year, expire_parse.month, expire_parse.day);
    
            if(today_Date > expire_Date) return Promise.reject({status:102, message:"failed_expire"})

            return Promise.resolve({status:102, message:"success"})

        }catch(error){
            return Promise.reject({status:102, message:"error"})
        }
    }
}