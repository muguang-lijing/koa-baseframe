/**
 * @api {get} /other/banner_list 获取banner列表  
 * @apiDescription 作者：System  
 * 
 * @apiVersion 0.0.1
 * @apiName get_banner_list
 * @apiGroup System_auto
 * 
 * @apiParam {String} page 页码 可不填
 * @apiParam {String} len 页长 可不填
 * 
 * @apiSuccess {Object} err 错误信息
 * @apiSuccess {Object} out 成功信息
 * @apiSuccessExample {json} 成功时返回的结果：
 * {
 * 	err: { code: 0 },
 * 	out: {
 * 		count: 34,
 *      datas: [ ... ] 
 * 	}
 * }
 */
router.get('/banner_list', async (ctx, next) => {
    let query = ctx.query;
    // 表 banner 所有字段：id,type,img_url,content_url,time,order 
    let page = query.page || 0;
    let len = query.len || 10;
    let whereOption = {};
    let result = await models.banner.findAndCountAll({
        where: whereOption,
        limit: parseInt(len),
        offset: page * len,
        attributes: ["id", "type", "img_url", "content_url", "time", "order"],
        order: [
            ["todo..", "DESC"],
            ["todo..", "DESC"]
        ]
    });
    let datas = result.rows;
    datas = JSON.parse(JSON.stringify(datas));
    for (let c of datas) {
        /* todo.. */
    }
    ctx.body = {
        err: {
            code: 0
        },
        out: {
            count: result.count,
            datas
        }
    };
});
