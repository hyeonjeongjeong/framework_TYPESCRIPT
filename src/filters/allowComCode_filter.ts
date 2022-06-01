import { ExecutionContext } from "../context/execution_context";


export async function allowComCode_filter(com_code:string[], context:ExecutionContext){
    
    const userDao = context.userDao;
    const user = await userDao.getById(context.req.body.request_id);
    let result = false;
    if(user !== undefined) {
        result = com_code.some((com) => {
            if(user.company.company_code == com){
                return true;
            }   
        })
    }

    return result;
   
}