import { ExecutionContext } from "../../context/execution_context";
import { allowComCode } from "../../decorator";
import { IPolicy, IPolicyResult } from "../policy";

// company의 limit_user가 now_user에서 지금 추가하면 넘을지 검사 
@allowComCode(["80000"]) // 800000인 회사코드는 이거 안본다 
export class LimitUserCount implements IPolicy {

    async apply(context: ExecutionContext): Promise<IPolicyResult> {
        // company_code로 company 찾기
        const companyDao = context.companyDao;
        const company = await companyDao.getByComCode(context.req.body.request_company_code);
        if(company !== undefined){
            // 추가되면 넘을거다 
            if(company.now_user + 1 > company.limit_user)
                return Promise.reject({"status": 202, "message": "failed_over_user"})
            return Promise.resolve({"status": 202, "message": "success"})
        }
        return Promise.reject({"status": 202, "message": "failed_company"})
        
    }
}