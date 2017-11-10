'use strict';

const models = require('../models');

(async ()=>{
    let cur_tm = parseInt(Date.now()/1000);
    let test_datas = [
        {
            name: '青椒',
            weight: 876,
            price: 555,
            attrs: {
                "是否无公害": false,
                "是否配送": true,
                "产地": "福建"
            },
            extra: {
                '备注': '高质量',
                'comment': [
                    'xxxtest',
                    'yyytest',
                    'uuuioji'
                ]
            },
            create_time: cur_tm
        },
        {
            name: '绿豆',
            weight: 998,
            price: 78,
            attrs: {
                "是否无公害": true,
                "是否配送": false,
                "产地": "陕西"
            },
            extra: {
                '备注': '高质量',
                'comment': [
                    {name: 'hhe' },
                    {name: 'jiii'}
                ]
            },
            create_time: cur_tm
        }
    ];
    await models.massive.bulkCreate(test_datas);
    console.log('ok');
})().catch(e=>{
    console.error(e);
})