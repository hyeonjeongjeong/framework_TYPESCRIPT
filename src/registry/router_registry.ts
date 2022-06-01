export const map = new Map<any, IClassInfo>();

export interface IClassInfo{
    paths:IFuncInfo[],
}

// 클래스 안에 한 함수에는 여러 필터가 존재할 수 있다.
export interface IFuncInfo {
    url:string,
    method:string,
    propertyKey:string,
    filters:any[]// 함수 전용 필터 

} 

// import 된 처음 시점에서 생성됨 => 이후 import 되면 다 같이 공유한다 
export const router_registry = {

    set:function(key:any, value:IClassInfo){
        map.set(key, value);
    },

    get: function(key:any){
        if(map.has(key))
            return map.get(key)
    },
    has: function(key:any){
        return map.has(key);
    },

    getEntries: function(){
        return map.entries();
    }
}
