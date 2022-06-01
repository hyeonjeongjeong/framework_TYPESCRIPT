import { convertDateFormat } from "../../util/date_util";

export class Company{
    company_code: string;
    expire_date: string;
    start_date: string;
    limit_user:number;
    now_user:number;
    constructor(company_code:string, limit_user:number, now_user:number, expire_date:string, start_date:string = convertDateFormat(new Date())){
        this.company_code = company_code
        this.start_date = start_date
        this.expire_date = expire_date
        this.limit_user = limit_user
        this.now_user = now_user
    }

}

export interface ICompayDao {
    getAll():Promise<Company[]>;
    getByComCode(com_code: string): Promise<Company>;
    add(company: Company): Promise<void>;
    modify(company: Company): Promise<void>;
}

// json to Company
export function jsonToCompany(json:any):Company{
       
    let company = new Company(json.company_code,json.limit_user, json.now_user, json.expire_date, json.start_date)

    return company
}