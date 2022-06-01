import { Company, ICompayDao, jsonToCompany } from "./company";
import * as fs from 'fs';
import { db_info } from "../../../database/db_info";

const db_type = db_info['db'];
const db_companys = db_type.path + db_type.table.company;

export class CompanyDao implements ICompayDao {
    async getAll(): Promise<Company[]> {
        let data = fs.readFileSync(db_companys, 'utf-8');
        let data_json = JSON.parse(data).companys;

        let companys:Company[] = [];
        
        data_json.forEach((element:any) => {
            companys.push(jsonToCompany(element));
        });
        
        return companys;
    }
    async getByComCode(com_code: string): Promise<Company> {
        try{
            let companys = await this.getAll();

            // companys 탐색하며 user_id가 일치하는 것을 찾는다 
            let company:Company|undefined = companys.find((item:any) => {
                return item.company_code == com_code
            });

            return company != undefined ? jsonToCompany(company) : undefined
        }catch(error){
            console.log(error);
            return undefined;
        }
    }
    async add(company: Company): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async modify(company: Company): Promise<void> {
        throw new Error("Method not implemented.");
    }

}