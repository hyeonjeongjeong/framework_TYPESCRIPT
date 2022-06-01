// 00/00/0000 날짜를 0000-00-00로 바꾸기 

export function convertDateFormat(date:Date){
    const date_str = date.toLocaleDateString('en-US')
    let date_list = date_str.split('/');
    let new_date_list = [];
    let date_json = {
        year: date_list[2],
        month : date_list[0],
        day : date_list[1]
    }

    new_date_list.push(date_json.year, date_json.month, date_json.day);

    new_date_list.forEach((item, index) => {
        if(item.length == 1) new_date_list[index] = '0' + item
    });
    return new_date_list.join('-')
}