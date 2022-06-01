import { router_registry } from '../registry/router_registry' // import는 최초한번만함 
import { allowComCode_filter } from '../filters/allowComCode_filter'
import { permission_filter } from '../filters/permission_filter'
import { policy_registry } from '../registry/policy_registry'



export const get = function(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const obj = {
            url: path,
            method: 'get',
            propertyKey: propertyKey,
            filters: [] 
        }
        // 이 target을 key로 가지는 object가 없다면 => 새로 생성 
        let map = router_registry.get(target.constructor);
        if(map === undefined){
            router_registry.set(target.constructor, {
                paths:[obj]
            })
        }
        // 이미 있다면 => 기존 클래스에 path를 새로 추가 
        else map.paths.push(obj)

    }
}

export const post = function(path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const obj = {
            url: path,
            method: 'post',
            propertyKey: propertyKey,
            filters: [] 
        }
        // 이 target을 key로 가지는 object가 없다면 => 새로 생성 
        let map = router_registry.get(target.constructor);
        if(map === undefined){
            router_registry.set(target.constructor, {
                paths:[obj]
            })
        }
        // 이미 있다면 => 기존 클래스에 path를 새로 추가 
        else map.paths.push(obj)
       
    }
}

// com_code 가 들어오면 정책을 무시한다 
// import 될 때 무조건 실행된다 
// key: allowComCode, [80000] 이 이미 등록되어 있을 것이다. 
// target: ContractPeriod
// class에 씌워지는 데코레이터이다 
export const allowComCode = function(com_code: string[]):any {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const obj = {
            func: allowComCode_filter,
            param: com_code,
        }

        // 이 target을 key로 가지는 object가 없다면 => 새로 생성 
        let map = policy_registry.get(target);
        if(map === undefined){
            policy_registry.set(target, {

                filters:[obj]
            })
        }else{
            map.filters.push(obj);
        }
       
    }
}

export const permission = function(role: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const obj = {
            func: permission_filter,
            param: role,
        }
        // 이 target을 key로 가지는 object가 없다면 => 새로 생성 
        let paths = router_registry.get(target.constructor).paths;
        paths.forEach((path) => {
            if(path.propertyKey == propertyKey){
                path.filters.push(obj)
            }
        })
    }
}

