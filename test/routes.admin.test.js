//接口单元测试

'use strict';
const superagent = require('supertest');
const app = require('../app');
const request = superagent(app.listen());
const should = require('should');
    describe('请求-hotran', function() {
        it('hotran return json', done => {
            request
                .get('/sel/hotran')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.datas[0].id).be.ok().and.be.a.String();
                    should(resObj.out.datas[0].name).be.ok().and.be.a.String();
                    should(resObj.out.datas[0].headimgurl).be.ok().and.be.a.String();
                    should(resObj.out.datas[0].introduction).be.ok().and.be.a.String();   
                })
                .end(function(err,res){
                    if(err) return  done(err);
                    done();
                })
                
        });
    });
    describe('请求-icomran', function() {
        it('icomran return json', done => {
            request
                .get('/sel/icomran')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.datas[0].id).be.ok().and.be.a.String();
                    should(resObj.out.datas[0].name).be.ok().and.be.a.String();
                    should(resObj.out.datas[0].headimgurl).be.ok().and.be.a.String();
                    should(resObj.out.datas[0].introduction).be.ok().and.be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-msgcount', function() {
        it('msgcount return json', done => {
            request
                .get('/sel/msgcount')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.Icomarr).be.a.Number();
                    should(resObj.out.Systarr).be.a.Number();
                    should(resObj.out.Favoarr).be.a.Number();
                    should(resObj.out.Fansarr).be.a.Number();
                    should(resObj.out.Messarr).be.a.Number();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-mywallet', function() {
        it('mywallet return json', done => {
            request
                .get('/sel/mywallet')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.Fans).be.a.Number();
                    should(resObj.out.Fouc).be.a.Number();
                    should(resObj.out.Skil).be.a.Number();
                    should(resObj.out.User.id).be.a.String();
                    should(resObj.out.User.name).be.a.String();
                    should(resObj.out.User.sex).be.a.String();
                    should(resObj.out.User.introduction).be.a.String();
                    should(resObj.out.User.headimgurl).be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-mycollection', function() {
        it('mycollection return json', done => {
            request
                .get('/sel/mycollection')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].cid).be.a.Number();
                    should(resObj.out.arr[0].sid).be.a.String();
                    should(resObj.out.arr[0].title).be.a.String();
                    should(resObj.out.arr[0].title_url).be.a.String();
                    should(resObj.out.arr[0].publisher_id).be.a.String();
                    should(resObj.out.arr[0].introduction).be.a.String();
                    should(resObj.out.arr[0].category).be.a.Number();
                    should(resObj.out.arr[0].favour_num).be.a.Number();
                    should(resObj.out.arr[0].comment).be.a.Number();
                    should(resObj.out.arr[0].collect_time).be.a.Number();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-myattention', function() {
        it('myattention return json', done => {
            request
                .get('/sel/myattention')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].id).be.a.String();
                    should(resObj.out.arr[0].follower_id).be.a.String();
                    should(resObj.out.arr[0].follower_id).be.a.String();
                    should(resObj.out.arr[0].name).be.a.String();
                    should(resObj.out.arr[0].sex).be.a.String();
                    should(resObj.out.arr[0].headimgurl).be.a.String();
                    should(resObj.out.arr[0].birthday).be.a.Number();
                    should(resObj.out.arr[0].introduction).be.a.String();
                    should(resObj.out.arr[0].created_at).be.a.String();
                    should(resObj.out.arr[0].updated_at).be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-myattention', function() {
        it('myattention return json', done => {
            request
                .get('/sel/myattention')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].id).be.a.String();
                    should(resObj.out.arr[0].follower_id).be.a.String();
                    should(resObj.out.arr[0].name).be.a.String();
                    should(resObj.out.arr[0].sex).be.a.String();
                    should(resObj.out.arr[0].headimgurl).be.a.String();
                    should(resObj.out.arr[0].birthday).be.a.Number();
                    should(resObj.out.arr[0].introduction).be.a.String();
                    should(resObj.out.arr[0].created_at).be.a.String();
                    should(resObj.out.arr[0].updated_at).be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-myfans', function() {
        it('myfans return json', done => {
            request
                .get('/sel/myfans')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].id).be.a.String();
                    should(resObj.out.arr[0].follower_id).be.a.String();
                    should(resObj.out.arr[0].name).be.a.String();
                    should(resObj.out.arr[0].sex).be.a.String();
                    should(resObj.out.arr[0].headimgurl).be.a.String();
                    should(resObj.out.arr[0].birthday).be.a.Number();
                    should(resObj.out.arr[0].introduction).be.a.String();
                    should(resObj.out.arr[0].created_at).be.a.String();
                    should(resObj.out.arr[0].updated_at).be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
   describe('请求-myskill', function() {
        it('myskill return json', done => {
            request
                .get('/sel/myskill')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].id).be.a.String();
                    should(resObj.out.arr[0].title).be.a.String();
                    should(resObj.out.arr[0].title_url).be.a.String();
                    should(resObj.out.arr[0].publisher_id).be.a.String();
                    should(resObj.out.arr[0].introduction).be.a.String();
                    should(resObj.out.arr[0].favour_num).be.a.Number();
                    should(resObj.out.arr[0].comment).be.a.Number();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
   describe('请求-myvoucher', function() {
        it('myvoucher return json', done => {
            request
                .get('/sel/myvoucher?method=unpass')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].user_id).be.a.String();
                    should(resObj.out.arr[0].name).be.a.String();
                    should(resObj.out.arr[0].new_user_id).be.a.String();
                    should(resObj.out.arr[0].price).be.a.Number();
                    should(resObj.out.arr[0].max_price).be.a.Number();
                    should(resObj.out.arr[0].begin).be.a.Number();
                    should(resObj.out.arr[0].invite_code).be.a.String();
                    should(resObj.out.arr[0].description ).be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });

   describe('请求-purchase', function() {
        it('purchase return json', done => {
            request
                .get('/sel/purchase')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].order_id).be.a.String();
                    should(resObj.out.arr[0].skill_id).be.a.String();
                    should(resObj.out.arr[0].title).be.a.String();
                    should(resObj.out.arr[0].title_url).be.a.String();
                    should(resObj.out.arr[0].publisher_id).be.a.String();

                    should(resObj.out.arr[0].introduction).be.a.String();
                    should(resObj.out.arr[0].category).be.a.Number();
                    should(resObj.out.arr[0].favour_num ).be.a.Number();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-selincome', function() {
        it('selincome return json', done => {
            request
                .get('/sel/selincome')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].type).be.a.String();
                    should(resObj.out.arr[0].skill_id).be.a.String();
                    should(resObj.out.arr[0].the_user_id).be.a.String();
                    should(resObj.out.arr[0].the_user_name).be.a.String();
                    should(resObj.out.arr[0].the_user_headimgurl).be.a.String();
                    should(resObj.out.arr[0].skill_title).be.a.String();
                    should(resObj.out.arr[0].skill_title_url).be.a.String();
                    should(resObj.out.arr[0].put_money ).be.a.Number();
                    should(resObj.out.arr[0].time ).be.a.Number();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-skillpoint_records', function() {
        it('skillpoint_records return json', done => {
            request
                .get('/sel/skillpoint_records')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.arr[0].type).be.a.String();
                    should(resObj.out.arr[0].get_num).be.a.Number();
                    should(resObj.out.arr[0].put_id).be.a.String();
                    should(resObj.out.arr[0].put_money).be.a.Number();
                    should(resObj.out.arr[0].skill_title).be.a.String();
                    should(resObj.out.arr[0].skill_title_url).be.a.String();
                    should(resObj.out.arr[0].skill_price).be.a.Number();
                    should(resObj.out.arr[0].time ).be.a.Number();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-/recommend/hot_category', function() {
        it('/recommend/hot_category return json', done => {
            request
                .get('/recommend/hot_category')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.datas[0].category).be.a.Number();
                    should(resObj.out.datas[0].category_name).be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-/recommend/hot_users', function() {
        it('/recommend/hot_users return json', done => {
            request
                .get('/recommend/hot_users')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    should(resObj.out.datas[0].id).be.a.String();
                    should(resObj.out.datas[0].name).be.a.String();
                    should(resObj.out.datas[0].headimgurl).be.a.String();
                    should(resObj.out.datas[0].introduction).be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });
    describe('请求-/follower/follow_dyn ', function() {
        it('/follower/follow_dyn  return json', done => {
            request
                .get('/follower/follow_dyn')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(function(res){
                    let resObj = JSON.parse(res.text);
                    console.log(resObj);
                    // should(resObj.out.datas[0].id).be.a.String();
                    // should(resObj.out.datas[0].name).be.a.String();
                    // should(resObj.out.datas[0].head).be.a.String();
                    // should(resObj.out.datas[0].introduction).be.a.String();
                })
                .end(function(err,res){
                    if(err){
                        return done(err);
                    } 
                        done();
                })
                
        });
    });