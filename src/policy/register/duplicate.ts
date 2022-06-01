import { ExecutionContext } from "../../context/execution_context";
import { IPolicy, IPolicyResult } from "../policy";

// 아이디 중복 확인 => 같은 company code 끼리는 중복해도 된다 
export class Duplicate implements IPolicy {

    async apply(context: ExecutionContext): Promise<IPolicyResult> {
        // company_code로 company 찾기
        const companyDao = context.companyDao;
        const userDao = context.userDao;

        // 같은 아이디가 있는지 찾는다 
        const user = await userDao.getById(context.req.body.request_id);

        if(user === undefined) return Promise.resolve({"status": 201, "message": "success"})
        
        // 같은 아이디가 있는 경우 => company 검사 
        const company = await companyDao.getByComCode(context.req.body.request_company_code);
        if(company !== undefined){
            // 회사번호도 같다 
            if(user.company.company_code == company.company_code)
                return Promise.reject({"status": 201, "message": "failed_id"})

            // 회사번호는 다르다 
            return Promise.resolve({"status": 201, "message": "success"})
        }
        return Promise.reject({"status": 201, "message": "failed_company"})
        
    }
}