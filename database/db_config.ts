import { UserDao as UserDaoFile } from '../src/model/user/user_dao_file'
import { UserDao as UserDaoDB } from '../src/model/user/user_dao_db'
import { CompanyDao as CompanyDaoFile } from '../src/model/company/company_dao_file'
import { CompanyDao as CompanyDaoDB } from '../src/model/company/company_dao_db'

export const db_config = {
  
    file: {
        dao: {
            user: new UserDaoFile(),
            company: new CompanyDaoFile()
        }
    },
    db: {
        dao: {
            user: new UserDaoDB(),
            company: new CompanyDaoDB()
        }
        
    }
}
