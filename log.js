/**
 * @api {get} /admin/product_list 获取product列表  
 * @apiDescription 作者：System  
 * 
 * @apiVersion 0.0.1
 * @apiName get_product_list
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
 *      datas: [ ... ] 
 * 	}
 * }
 */
router.get('/product_list', async (ctx, next) => {
    let query = ctx.query;
    // 表 product 所有字段：id,name,id_f_pro_category,id_f_pro_brand,intro,title_url,pics,attrs,mobile_html,pc_html,is_show,extra,create_time 
    let page = query.page || 0;
    let len = query.len || 10;
    let whereOption = {};
    let datas = await models.product.findAll({
        where: whereOption,
        limit: parseInt(len),
        offset: page * len,
        attributes: ["id", "name", "id_f_pro_category", "id_f_pro_brand", "intro", "title_url", "pics", "attrs", "mobile_html", "pc_html", "is_show", "extra", "create_time"],
        order: [
            ["todo..", "DESC"]
        ]
    });
    ctx.body = {
        err: {
            code: 0
        },
        out: {
            datas
        }
    };
});
