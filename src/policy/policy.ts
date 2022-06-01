import { ExecutionContext } from "../context/execution_context";
import { User } from "../model/user/user";

export interface IPolicyResult {
    status: number; 
    message?: string;
    user?: User;
}


export interface IPolicy {
    apply(context: ExecutionContext): Promise<IPolicyResult>;
}
