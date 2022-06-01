import { ExecutionContext } from "../context/execution_context";

export async function permission_filter(context:ExecutionContext, role:string){
    const userDao = context.userDao;
    const user = await userDao.getById(context.req.params.userid);

    let result = false;

    if(user !== undefined) {
        switch(role){
            case 'admin': 
                result = (user.admin) ? true : false;
                break;
            case 'write':
                result = (user.permission.includes('write')) ? true : false;
                break;
            case 'read':
                result = (user.permission.includes('read')) ? true : false;
                break;

        }
    }
    return result;
}