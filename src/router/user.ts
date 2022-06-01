import { ExecutionContext } from '../context/execution_context';
import { get, permission, post } from '../decorator';
import { User } from '../model/user/user';


export class UserRouter {

    @get("/user/:userid")
    async getUser(context: ExecutionContext) {
        const userDao = context.userDao;
        const userid = context.req.params.userid;
     
        // user_id로 user 찾기
        const user = await userDao.getById(userid);
     
        (user !== undefined) ? context.res.send({status:200, result: "success", user: user}):
        context.res.send({status:200, result: "failed_user"})
    }

    // ajax로 요청
    @permission("admin")    //관리자 권한이 아닐 경우 해당 요청에 대한 응답 코드는 403로 처리
    @post("/register/:userid") //user_id는 등록 요청을 한 계정의 id(로그인한 계정의 id)
    async registerUser(context: ExecutionContext) {
        // context에서 등록 정책을 가져온다 
        const policies = await context.getRegisterPolicy();

        // 정책 검사 
        const result = await context.checkPolicies(policies)

        if(result === undefined){
            if(await this.addUser(context))
                context.res.send({"status":200, "result": "success"})

            else context.res.send({"status":200, "result": "failed_add_user"})

        }else{
            context.res.send(result);
        }

    }

    @get("/user/register")
    registerUserView(context: ExecutionContext) {
        context.res.send({"result":"success"})
    }

    async addUser(context:ExecutionContext):Promise<boolean> {
        try{
            const companyDao = context.companyDao;
            const userDao = context.userDao;
            const user_info = context.req.body;
            const company = await companyDao.getByComCode(user_info.request_company_code)

            company.now_user += 1;
            await userDao.add(new User(
                user_info.request_id,
                user_info.request_pw,
                user_info.request_permission,
                user_info.request_admin,
                company))

            await companyDao.modify(company)

         
        }catch(error){
            console.log(error);
            return false
        }
        return true
        
    }

}
