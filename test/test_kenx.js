'use strict';
// 官网参考：　http://knexjs.org/
const config = require('../config');
const uuid = require('uuid');
const knex = config.knex;

let sql = [];
sql[0] = knex.select().table('books');
sql[1] = knex.select('title','year').from('books');
sql[2] = knex.column('title', 'author', 'year').select().from('books');
sql[3] = knex('users').where('sex',false);
sql[4] = knex('users').where('age','>',23);
sql[5] = knex('books').where('bookname', 'like', '%newbook%');
sql[5] = knex('users').where({ first_name: 'Test', last_name:  'User' }).select('id');
sql[6] = knex('users').where('votes', '>', 100).andWhere('status', 'active').orWhere('name', 'John').select('id');
sql[7] = knex('users').where({'id': 1,'sex': true}).orWhere({votes: 100, user: 'knex'});
sql[8] = knex.whereIn('id', ['1', '4', '9']).from('users');
sql[9] = knex('users').whereNull('updated_at');
sql[10] = knex('users').join('contacts', 'users.id', '=', 'contacts.user_id').select('users.id', 'contacts.phone');
sql[11] = knex('users').where('users.age','>',23).andWhere('status', 'active')
.leftJoin('books','users.id','books.author').
column(['users.id', 'name']);
sql[12] = knex.select('title','year').orderBy('time', 'desc');
sql[13] = knex('users').count('active as a');
sql[14] = knex('users').max('age');
sql[15] = knex('users').sum('products as p');
sql[16] = knex('books').where('id', '=', 1).increment('read', 10);

sql.forEach((v,i)=>{
    console.log(i+" : "+v.toString());
})

// (async () => {
//     let out = await knex('banner').insert({
//         id: uuid.v1(),
//         img_url: 'eeeee.jpg', 
//         content_url: 'eee.com', 
//         type: 'skill_video'
//     });
//     console.log("insert ok!!!!!!!!!!!!!!!!");
// })().catch(e=>{
//     console.error(e);
// })