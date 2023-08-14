const express =require("express")
const app = express();
const path = require("path")
const multer = require("multer")
const { db, genid } = require("./db/DbUtils")//es6的解构赋值
const port = 8080

//开放跨域请求
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});
app.use(express.json())//?引入JSON用于前后端交互(注意位置之前出过错)
//当客户端发送带有 JSON 格式数据的 POST 请求时，该中间件会将请求体中的 JSON 数据解析成 JavaScript 对象，并将其作为 req.body 对象的属性，以供后续的路由处理程序使用。

const update = multer({
    dest: "./public/upload/temp"
})
app.use(update.any())
//静态资源路径
app.use(express.static(path.join(__dirname, "public")))//app.use(express.static(path.join(__dirname, "public")))这段代码是使用Express框架中的中间件函数express.static来将public目录下的静态文件（如图片、CSS、JavaScript文件等）托管到Web服务器上，以便客户端可以直接访问这些文件。其中

//*token验证
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req, res, next) => {//通常用于定义全局中间件或处理程序
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {//用于检查当前请求路径是否包含/_token

        let { token } = req.headers;//用于从 HTTP 请求的头部中获取一个名为 token 的变量。//*前端传的

        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminResult = await db.async.all(admin_token_sql,[token])
        if(adminResult.err != null || adminResult.rows.length == 0){
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return 
        }else{
            next()
        }
    }else{
        next()
    }
})

app.use("/test",require("./routers/TestRouter"))//"/test"，表示所有以 "/test" 开头的请求都会进入这个中间件处理程序，//* TestRouter被视为一个程序
app.use("/admin",require("./routers/AdminRouter"))
app.use("/category",require("./routers/CategoryRouter"))
app.use("/blog",require("./routers/BlogRouter"))
app.use("/upload",require("./routers/UploadRouter"))


//先验证跨域再前后端交互


//客户端发送
app.get("/",(req,res)=>{ 
    res.send("原神，启动");
})
//服务端相应
app.listen(port,()=>{
    console.log(`服务器已启动，监听端口: http://localhost:${port}/`);
})