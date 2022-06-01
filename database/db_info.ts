import path from "path";

export const db_info= {
    file: {
        path: path.join(__dirname + '/file/'),
        table: {
            user: 'users.json',
            company: 'companys.json'
        }
    }
    ,
    db: {
        path: path.join(__dirname + '/file/'),
        table: {
            user: 'users.json',
            company: 'companys.json'
        }
    }
}