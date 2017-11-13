'use strict';

const models = require('../models');

(async ()=>{
    let cur_tm = parseInt(Date.now()/1000);
    let test_datas = [
        {
            name: '草莓',
            weight: 223,
            price: 789,
            attrs: {
                "是否无公害": true,
                "是否配送": true,
                "产地": "山东"
            },
            extra: {
                'comment': 'a good place',
                'money': {
                    default: 14,
                    discount: 24
                }
            },
            create_time: cur_tm
        },
        {
            name: '丝瓜',
            weight: 239,
            price: 129,
            attrs: {
                "是否无公害": false,
                "是否配送": true,
                "产地": "河南"
            },
            extra: {
                '备注': '需预订',
                'comment': 'delicious',
                'money': {
                    default: 129,
                    discount: 100
                }
            },
            create_time: cur_tm
        }
    ];
    await models.massive.bulkCreate(test_datas);
    console.log('ok');
})().catch(e=>{
    console.error(e);
})