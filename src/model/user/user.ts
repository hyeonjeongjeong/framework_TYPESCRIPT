import { convertDateFormat } from "../../util/date_util";
import { Company, jsonToCompany } from "../company/company";

export class User{
    id: string;
    password: string;
    permission: string[];
    admin: boolean;
    company: Company;
    register_date: string;
    visit_date: string;

    constructor(id:string, password:string, permission:string[], admin:boolean, company:Company, 
        register_date:string = convertDateFormat(new Date()), 
        visit_date:string = ''){
        this.id = id
        this.password = password
        this.permission = permission
        this.admin = admin
        this.company = company
        this.register_date = register_date
        this.visit_date = visit_date
    }

    toString():string{
        return `
            Id:             ${this.id}
            Permission:     ${this.permission}
            Admin:          ${this.admin}
            Company:        ${this.company.company_code}
            Register_date:  ${this.register_date}
            Visit_date:     ${this.visit_date}
        `;
    }
}

export interface IUserDao {
    getAll(): Promise<User[]>
    getById(id: string): Promise<User>;
    add(user: User): Promise<void>;
    modify(user: User): Promise<void>;
}

// json to USer
export function jsonToUser(json:any):User{
    return new User(json.id, json.password, json.permission, 
     json.admin, jsonToCompany(json.company), json.register_date, json.visit_date)
 
 }