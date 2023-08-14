const express = require("express")
const router = express.Router()
const { db, genid } = require("../db/DbUtils")//es6的解构赋值
//const DbUtils = require("../db/DbUtils");
//const db = DbUtils.db;
//const genid = DbUtils.genid;


router.get("/test",async (req, res) => {
    //db.all(sql, [params], callback);
    /* db.all("select * from `admin`", [], (err, rows) => {
        console.log(rows)//会打印在服务器
     })
     db.async.all("select * from `admin`", []).then((res) => {
        console.log(res)
     })*/
//雪花函数用法
     let out = await db.async.all("select * from `admin`",[])  //*使用await/async代替then避免回调地狱，out被赋值为为{ err, rows }
    res.send({
        id:genid.NextId(),//显示在test/test
        out//相当于out:out(es6特性)
    })
    
})

module.exports = router//*模块化所以分不同的js文件赋予router功能


