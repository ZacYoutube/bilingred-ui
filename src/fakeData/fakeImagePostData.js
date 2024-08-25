import { faker } from '@faker-js/faker';

function generateImagePostData(){

    let array = [];

    // for(let i=1; i<1000; i++){
    //     array.push({
    //         profileName : faker.name.fullName(),
    //         profileImageUrl : faker.image.avatar(),
    //         title : faker.commerce.productDescription(),
    //         text : faker.lorem.lines(),
    //         displayImageOneUrl : faker.image.city(600,800,true),
    //         displayImageTwoUrl : faker.image.city(600,800,true)
    //     })
    // }
    for(let i=1; i<1000; i++){
        array.push({
            profileName : "小猪大猪都是猪",
            profileImageUrl : faker.image.avatar(),
            title : "学校附近新装修 套房出租 都带独立卫浴 小四川旁",
            text : "新房新装修拎包入住在小四川附近 开车3分钟到校 骑车6分钟 房间均带有独立卫浴。步行均可达cvs 银行 小四川 超 电话：631-559-6162，微：2330578534",
            displayImageOneUrl : faker.image.city(600,800,true),
            displayImageTwoUrl : faker.image.city(600,800,true)
        })
    }

    return array;
}

export default generateImagePostData();

