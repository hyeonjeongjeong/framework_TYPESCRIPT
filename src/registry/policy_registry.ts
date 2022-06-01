export const map = new Map<any, IClassInfo>();

export interface IClassInfo{
    filters: any[]

}
export const policy_registry = {

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
