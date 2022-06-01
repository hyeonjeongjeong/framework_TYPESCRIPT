import { IPolicy } from "../policy/policy";

type databaseSystem = "file" | "db";
// 서버 설정 인터페이스 
export interface IServerConfiguration {
    router: any[]; // 라우터 list
    policy: { // 정책 list
        // [string]: IPolicy[]
    }
    database: databaseSystem; // 데이터베이스 뭘로 할 것인지 
}
