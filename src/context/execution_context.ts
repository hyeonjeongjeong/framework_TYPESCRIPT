import e from "express";
import { ICompayDao } from "../model/company/company";
import { IUserDao } from "../model/user/user";
import { IPolicy } from "../policy/policy";
import { IClassInfo } from "../registry/policy_registry";


interface IRequestBody{
    request_id: string;
    request_pw: string;
    request_permission: string[];
    request_admin: boolean;
    request_company_code: string;

}

interface IRequestParams{
    userid: string;
}

export class ExecutionContext {

    constructor(
        public req: e.Request<IRequestParams, any, IRequestBody>, 
        public res: e.Response, 
        public userDao: IUserDao, 
        public companyDao: ICompayDao,
        public policies?: any,
        private policy_filter?: any) {

    }

    // login 필터를 여기서 실행하면서 걸러서 반환한다 
    async getLoginPolicy(): Promise<IPolicy[]> {
        const policies = await this.getPolicy('login');
        console.log('policies',policies)
        return policies;
    }

    // register
    async getRegisterPolicy(): Promise<IPolicy[]> {
        const policies = await this.getPolicy('register');
        return policies;
    }

    // 필터되는 정책 빼고 나머지 저장해서 반환 
    async getPolicy(policy:string):Promise<any[]>{
       
        let policies_list = []

        for(let klass of this.policies[policy]){
            const policyMap = this.policy_filter.get(klass);
            let result = false;

            if(policyMap !== undefined){
                // 필터 돌면서 

                for(let filter of policyMap.filters){
                    // 필터에 걸리지 않았다면 검사 해야함 
                    if(await filter.func(filter.param, this)) result = true;
                }

                if(!result) policies_list.push(klass);

            }else policies_list.push(klass)
            
        }

        return policies_list;
    }


    async checkPolicies(policies:IPolicy[]){
        let result = undefined;

        const policy_promise = policies.reduce(async(promise, policy, index) => {
            return promise.then(async() => {
                await policy['prototype'].apply(this);
            })
        }, Promise.resolve()).catch((msg) => { result = msg })

        await policy_promise;

        return result;
    }

}