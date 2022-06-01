
import { ExecutionContext } from '../context/execution_context';
import { get, post } from '../decorator';
import { User } from '../model/user/user';
import { IPolicy } from '../policy/policy';
import { convertDateFormat } from '../util/date_util';

export class LoginRouter {

    // 로그인 페이지가 들어갈 자리 
    @get("/login")
    loginView(context: ExecutionContext) {
     
        context.res.send({result: context.req.query});
    }

    // ajax 요청 할것
    @post("/login")
    async loginProcess(context: ExecutionContext) {
        const userDao = context.userDao;
        const user_id = context.req.body.request_id;

        // context에서 로그인 정책을 가져온다 
        const policies = await context.getLoginPolicy();

        // 정책 검사 
        const result = await context.checkPolicies(policies)
        let user:User;

        if((await result === undefined)){
            // 로그인시 방문일자 갱신 
            user = await userDao.getById(user_id);
            user.visit_date = convertDateFormat(new Date());

            await userDao.modify(user);

            context.res.send({"status":100, "result": "success", "user_info": user})
        }
        else context.res.send(result);
   
        
    }

}