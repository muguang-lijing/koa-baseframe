
var w = Vue.component('w',{
    template:'#w',
    props: {
        row: Object
    },
    methods:{
    }
})

Vue.component('m', {
    template: '#m',
    components: {w},
    data(){
        return {
            columns: [
                {
                    title: '标签',
                    key: 'tag',
                    width:'120px'
                },
                {
                    title: '信息',
                    key: 'msg',
                    width:'350px',
                    ellipsis:"true",
                },
                {
                    title: '数据',
                    key: 'data',
                },
                {
                    title: '级别',
                    key: 'level',
                    width:'70px'
                },
                {
                    title: '时间',
                    key: 'time',
                    width:'150px',
                    render: (h, params) => {
                         return moment.unix(params.row.time).format('YYYY-MM-DD HH:mm:ss');
                    }
                },
                {
                    type: 'expand',
                    width: 50,
                   
                    render: (h, params) => {
                        return h(w, {
                            props: {
                                row: params.row,
                            },
                            style:{
                                background:"#383C4A",
                                color:"#fff",
                            }
                        })
                    }
                },
            ],
            columns2: [
                {
                    title: '路由',
                    key: 'url',
                    width:"300px",
                },
                {
                    title: '类型',
                    key: 'type',
                },
                {
                    title: '请求体',
                    key: 'body',
                    width:"500px",
                    ellipsis:"true",
                },
                {
                    title: '耗时',
                    key: 'duration',
                    
                },
                {
                    title: '响应码',
                    key: 'res_status_code',
                },
                
                {
                    title: '时间',
                    key: 'time',
                    width:'150px',
                    render: (h, params) => {
                         return moment.unix(params.row.time).format('YYYY-MM-DD HH:mm:ss');
                    }
                },
                {
                    type: 'expand',
                    width: 50,
                    className: 'demo-table-info-column',
                    render: (h, params) => {
                        try{
                            var res_body = JSON.parse(params.row.res_body);
                        }catch(e){}
                        if (res_body){
                            params.row.res_body = res_body;
                        }
                        params.row.time_show = moment.unix(params.row.time).format('YYYY-MM-DD HH:mm:ss');
                        return h(w, {
                            props: {
                                row: params.row,
                            },
                            style:{
                                background:"#383C4A",
                                color:"#fff",
                            }
                        })
                    }
                },
            ],
            searone:{
                tag:'',
                msg:'',
                level:'',
                levellsit:[{label:"trace",value:10},{label:"debug",value:20},{label:"info",value:30},{label:"warn",value:40},{label:"error",value:50},{label:"fatal",value:60}],
                time:[],
                page:0,
                len:0
            },
            seartwo:{reqId:'',uid:'',url:'',type:'',cookie:'',user_agent:'',content_type:'',res_content_type:'',res_status_code:"",res_body:'',time:[],page:0,len:0,typelist:[{label:'GET',value:"GET"},{label:'POST',value:'POST'}]},
            data: [],
            data2:[],
            tabname:'nam1',
            visible: false,
            visible2: false,
            flag:true,
            tabh:'700',
            no_data:'数据加载中....',
            no_data2:'数据加载中....',
        }
    },
    methods:{
        handleOpen () {
            this.visible = true;
        },

        handleOpen2 () {
            this.visible2 = true;
        },

        get_one:function(e){
            this.data = [];
            var data = this.searone;
            e!=0?e--:'';
            var data = {
                page:e,
                len:data.len,
                tag:data.tag || undefined,
                msg:data.msg || undefined,
                level:data.level || undefined,
                start_tm:Date.parse(new Date(data.time[0]))/1000,
                end_tm:Date.parse(new Date(data.time[1]))/1000,
            }
            this.$http.post("/log/findAll",data).then(res =>{
                this.data = res.body.out.datas
                this.data.length == 0?this.no_data= '暂无数据':"";
                this.visible = false;
            })
        },

        get_two:function(e){
            this.data2 = [];
            var data = this.seartwo;
            e!=0?e--:'';
            var data = {
                page:e,
                len:data.len,
                reqId:data.reqId || undefined,
                uid:data.uid || undefined,
                url:data.url || undefined,
                type:data.type || undefined,
                cookie:data.cookie || undefined,
                user_agent:data.user_agent || undefined,
                res_body:data.res_body || undefined,
                content_type:data.content_type || undefined,
                res_status_code:parseInt(data.res_status_code) || undefined,
                start_tm:Date.parse(new Date(data.time[0]))/1000,
                end_tm:Date.parse(new Date(data.time[1]))/1000,
            }
            this.$http.post("/log/findReq",data).then(res =>{
                this.data2 = res.body.out.datas
                this.data2.length == 0?this.no_data2 = '暂无数据':"";
                this.visible2 = false;
            })
        },


        GetDateStr:function(AddDayCount) { 
            var dd = new Date(); 
            dd.setDate(dd.getDate()+AddDayCount);
            var y = dd.getFullYear(); 
            var m = dd.getMonth()+1;
            var d = dd.getDate(); 
            return y+"-"+m+"-"+d; 
        },
    },
    created(){
        var self = this;
        var start_time = this.GetDateStr(-2);
        var end_time = this.GetDateStr(0);
        this.searone.time = [start_time,end_time];
        this.seartwo.time = [start_time,end_time];
    },

    mounted(){  
        var winH = $(window).height();
        this.tabh = winH-180;
        this.searone.len =  Math.floor(winH/51)
        this.seartwo.len =  Math.floor(winH/51)
        this.get_one(0);
        this.get_two(0);
    }
})

new Vue({
    el: '#app',
    data:{},
    methods:{},
});

is_login();
function is_login(){
    $.get("/other/is_login",function(res){
        if(!res.out.result){
            alert("未登录");
            console.log("请登录,方法为 login(password)");
        }else{
            console.log("已登录");
            console.log("退出登录,方法为 logout()");
        }
    })
}

function login(pwd){
    $.post("/log/login",{pwd:pwd},function(res){
        if(res.out == "ok"){
            location.reload();
        }else{
            console.log(res.err);
        }
    })
}

function logout(){
    $.post("/log/logout",function(res){
        if(res.out == "ok"){
            console.log("已成功退出登录");
            location.reload();
        }else{
            console.log(res.err);
        }
    })
}




