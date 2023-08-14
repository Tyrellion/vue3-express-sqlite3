const express = require("express")
const router = express.Router()
const { db, genid } = require("../db/DbUtils")//es6的解构赋值
//查询博客详细信息
router.get("/detail", async (req, res) => {

    let { id } = req.query
    let detail_sql = "SELECT * FROM `blog` WHERE `id` = ? "
    let { err, rows } = await db.async.all(detail_sql, [id]) ;

    if (err == null) {
        res.send({
            code: 200,
            msg: "获取成功",
            rows
        })
    } else {
        res.send({
            code: 500,
            msg: "获取失败"
        })
    }

})
//查询接口
router.get("/search", async (req,res)=>{

    //*keyword 关键字 categoryId 分类编号
    //*分页： page 页码 pagesize 分页大小
    let{keyword,categoryId,page,pageSize}=req.query

    page = page == null ? 1 : page;
    pageSize = pageSize == null ? 10 : pageSize
    categoryId = categoryId == null ? 0 : categoryId
    keyword = keyword == null ? "" : keyword
    
    let params = []
    let whereSqls = []
    if (categoryId != 0) {
        whereSqls.push(" `category_id` = ? ")
        params.push(categoryId)
    }

    if (keyword != "") {
        whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ")//这表示在 SQL 查询中将同时匹配 title 和 content 字段中包含关键字的记录
        params.push("%" + keyword + "%")//字符串 %" + keyword + "% 是一个模糊查询的参数值，其中 % 符号表示匹配任意字符的通配符。
        params.push("%" + keyword + "%")
    }
    let whereSqlStr = ""
    if (whereSqls.length > 0) {
     //" `category_id` = ? " AND `title` LIKE ? OR `content` LIKE ?) "
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")
    }
    //查分页数据
    //let searchSql = " SELECT * FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? "
    let searchSql = " SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? "//限制展示数据长度
    // 1 10  2,10    3,5  page与pagesize
    // 0,10  10,10   10,5 从第0个开始列出10个(0~9)
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])//params.concat 是 JavaScript 数组的一个方法，用于将两个或多个数组合并成一个新的数组，而不改变原始数组。//*(params 数组) 和传递给 concat 方法的参数数组合并到新数组中//*DESC LIMIT ?,?
    
    //查询数据总数
    let searchCountSql = " SELECT count(*) AS `count` FROM `blog` " + whereSqlStr;
    let searchCountParams = params

       //分页数据
       let searchResult = await db.async.all(searchSql, searchSqlParams)
       let countResult = await db.async.all(searchCountSql, searchCountParams)
       
    if (searchResult.err == null && countResult.err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: {
                keyword,
                categoryId,
                page,
                pageSize,
                rows: searchResult.rows,
                count: countResult.rows[0].count
            }
        })

    } else {
        res.send({
            code: 500,
            msg: "查询失败",
        })
    }
})

// 删除接口 /blog/delete?id=xxx
router.delete("/_token/delete", async (req, res) => {
    let id = req.query.id
    const delete_sql = "DELETE FROM `blog` WHERE `id` = ?"
    let { err, rows } = await db.async.run(delete_sql, [id])

    if (err == null) {
        res.send({
            code: 200,
            msg: "删除成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }

})
//修改博客
router.put("/_token/update", async (req, res) => {

    let { id, title, categoryId, content } = req.body;
    let create_time = new Date().getTime();

    const update_sql = "UPDATE `blog` SET `title` = ?,`content` = ?,`category_id` = ? WHERE `id` = ?"
    let params = [title, content, categoryId, id]

    let { err, rows } = await db.async.run(update_sql, params)

    if (err == null) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }

})
//添加博客
router.post("/_token/add", async (req, res) => {

    let { title, categoryId, content } = req.body;//categoryId想要添加的分类对应的ID
    let id = genid.NextId();
    let create_time = new Date().getTime();

    const insert_sql = "INSERT INTO `blog`(`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)"
    let params = [id, title, categoryId, content, create_time]

    let { err, rows } = await db.async.run(insert_sql, params)

    if (err == null) {
        res.send({
            code: 200,
            msg: "添加成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }

})


module.exports = router//*模块化所以分不同的js文件赋予router功能


