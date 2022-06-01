import { ServerFactory } from './server/express';

// router
// import가 되면 바로 LoginRouter의 데코레이터들은 호출이 된다 
import { LoginRouter } from './router/login';
import { UserRouter } from './router/user';

// registry에 저 라우터들에서 사용되는 데코레이터들은 이미 실행된 상태 

// policy 
import { AccountStatus } from './policy/login/account_status';
import { ContractPeriod } from './policy/login/contract_period';
import { Identifier } from './policy/login/identifier';
import { Duplicate } from './policy/register/duplicate';
import { LimitUserCount } from './policy/register/limit_user_count';


async function bootstrap() {
    const port = 3000;
    const server = await ServerFactory.create({
        database: "file"/* db */,
        router: [LoginRouter, UserRouter],
        policy: { // 여기서 정책 등록 
            login: [Identifier, ContractPeriod, AccountStatus],
            register: [Duplicate, LimitUserCount]
        },
    });
    // 서버를 연다
    await server.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
}
bootstrap();