const express = require("express")
const { v4: uuidv4 } = require("uuid");
const router = express.Router()
const { db, genid } = require("../db/DbUtils")//es6的解构赋值


router.post("/login",async(req,res)=>{
    let { account,password }=req.body;//*服务端传递应该用req
    let { err,rows }= await db.async.all("select * from `admin` where `account` = ? AND `password` = ?",[account,password])//空格里为两个替代？的
    //?err和rows为db.all的参数不是promise的
    if(err==null && rows.length>0){

        let login_token = uuidv4();
        let update_token_sql = "UPDATE `admin` SET `token`=? where `id`=?"

        await db.async.run(update_token_sql,[login_token,rows[0].id])//上传token

        let admin_info = rows[0]
         admin_info.token =login_token
         admin_info.password =""//前端尽量不要暴露密码


        res.send({
            code:200,
            msg:"登陆成功",
            data:admin_info

        })
    }else{
        res.send({
            code:500,
            msg:"登陆失败"
        })
    }
})

module.exports = router


