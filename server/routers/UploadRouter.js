const express = require("express")
const router = express.Router()
const fs =require("fs")
const { db, genid } = require("../db/DbUtils")//es6的解构赋值

router.post("/rich_editor_upload",async (req,res)=>{

    if(!req.files){//是否有文件上传
        
        //multer要求返回格式        
        res.send({
            "errno": 1, // 只要不等于 0 就行
            "message": "失败信息"
        })
        return
    }

    let files = req.files;
    let ret_files = [];

    
    for (let file of files) {//for...of循环遍历了一个数组files中的所有元素
        //获取文件名字后缀
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1)//multer方法,file.originalname是上传文件的原始文件名
        //随机文件名字
        let file_name = genid.NextId() + "." + file_ext

        //修改名字加移动文件
        fs.renameSync(
            //process.cwd()方法获取当前工作目录的绝对路径
            process.cwd() + "/public/upload/temp/" + file.filename,//它表示上传后的文件在服务器上的存储名称
            process.cwd() + "/public/upload/" + file_name//服务端自定义名称
        )
        ret_files.push("/upload/" + file_name)
    }
//multer要求返回格式
    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            "url":ret_files[0], // 图片 src ，必须
        }
    })
})

module.exports = router//*模块化所以分不同的js文件赋予router功能


