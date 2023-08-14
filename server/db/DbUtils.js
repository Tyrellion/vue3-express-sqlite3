// 引入 sqlite3 模块并使用 verbose() 方法
const sqlite3 = require("sqlite3").verbose()

const path = require("path")
// 引入 Node.js 内置模块 path，用于处理文件路径
const GenId = require("../utils/SnowFlake")

// 创建一个 SQLite 数据库连接
var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"))
// 创建 Snowflake ID 生成器实例，传入 WorkerId 参数为 1
const genid = new GenId({ WorkerId: 1 })
// 将数据库连接对象 db 和 Snowflake ID 生成器对象 genid 导出成一个模块，以后就不用重复创建了


db.async={}//!db为一个对象，async为其属性，而属性值为对象（对象包对象）便于操作
//*promise避免回调地狱
db.async.all = (sql, params) => {//?这个db.async.all只是个名字和数据库没有关联,可以换成asyncAll
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({ err, rows })//*resolve将数据传出来，之后可以用then调用就不用嵌套了
        })
    })
}

db.async.run = (sql,params)=>{
    return new Promise ((resolve,reject)=>{
        db.run(sql,params,(err, rows)=>{
            resolve({err, rows})//*解构赋值
        })
    })
}


module.exports = { db, genid }