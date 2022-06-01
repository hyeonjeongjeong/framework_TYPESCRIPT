import e  from "express";
import express from "express";
import { IServerConfiguration } from "./configurations";
import { router_registry } from "../registry/router_registry";
import { db_config } from "../../database/db_config";
import { ExecutionContext } from "../context/execution_context";
import bodyParser from "body-parser";
import { IPolicyResult } from "../policy/policy";
import { map, policy_registry } from "../registry/policy_registry";

// 실제 express에 get, post 등록해야하는데
// 어떤 url에어떤 router를 등록해야하는지...
// 라우트를 여기에 저장해놨다가 던져주기?
export const ServerFactory = {

    async create(config: IServerConfiguration): Promise<e.Express> {
        const app = express();
        app.use(bodyParser.json())

        // router 처리 
        config.router.forEach((klass) => {
           
            const routerMap = router_registry.get(klass);
            
            routerMap.paths.forEach(pathInfo => {


                app[pathInfo.method](pathInfo.url, async (req: any, res: any) => {
          
                     // context 생성
                    let executionContext = new ExecutionContext(
                        req, 
                        res, 
                        db_config[config.database].dao.user,
                        db_config[config.database].dao.company,
                        config.policy,
                        policy_registry,
                    )

                    if (pathInfo.filters) {
                        for(const filter of pathInfo.filters) {
                            const func = filter.func;
                            const param = filter.param;
                           
                            if(await func(executionContext, param) === false) {
                 
                                res.sendStatus(403)
                                return false;
                            }
                        }
                    }
                    // 라우터 연결
                    const router = new klass();
                    router[pathInfo.propertyKey](executionContext);
                    

                });
            });
        });
        
        
        return app;
    },


}