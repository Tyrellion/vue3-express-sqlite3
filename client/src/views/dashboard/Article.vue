<template>
<!--  标签页 Tabs-->
   <n-tabs v-model:value="tabValue" justify-content="start" type="line"><!--  default-value默认第一个打开-->
      <n-tab-pane name="list" tab="文章列表">
        <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px">
          <n-card :title="blog.title">
            {{ blog.content.replace(/<[^>]+>/g, '') }}<!-- 将博客内容中的所有 HTML 标签都去除 -->

            <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button><!-- 点击跳转 -->
                            <n-button @click="toDelete(blog)">删除</n-button>
                        </n-space>
                    </template>
          </n-card>
        </div>
<!-- 分页-->

        <n-space>
                <div @click="toPage(pageNum)" v-for="pageNum in  pageInfo.pageCount"> <!--pageNum为v-for生成，故点击对应按钮就是对应pageNum-->
                    <div :style="'color:' + (pageNum == pageInfo.page ? 'blue' : '')">{{ pageNum }}</div>
                </div>
            </n-space>
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addArticle.categoryId" :options="categortyOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="addArticle.content"></rich-text-editor><!--  将 addArticle.content 作为父组件传递给子组件的一个 prop，监听子组件触发的 update:modelValue 事件，当事件触发时，将传递的新值更新到 addArticle.content。-->
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>
     
        </n-tab-pane>
        <n-tab-pane name="update" tab="修改">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.categoryId" :options="categortyOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject,onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'//使用路由
import RichTextEditor from '../../components/RichTextEditor.vue'//引入富文本组件//<rich-text-editor v-model="addArticle.content"></rich-text-editor>为其对应标签  //<script setup>不需要注册组件


const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
const adminStore = AdminStore()

//文章添加数据
const addArticle = reactive({
    categoryId: 0,
    title: "",
    content: "",
})
//文章修改数据
const updateArticle = reactive({
    id: 0,
    categoryId: 0,
    title: "",
    content: "",
})

//下拉分类选项
const categortyOptions = ref([])
//博客列表数据
const blogListInfo = ref([])
//标签页
const tabValue = ref("list")//定位标签页
//分页数据
const pageInfo = reactive({
    page: 1,
    pageSize: 3,
    pageCount: 0,//页数
    count: 0,
})

onMounted(() => {
    loadBlogs()
    loadCategorys()
})
//读取博客列表
const loadBlogs = async () => {
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
    let temp_rows = res.data.data.rows;
    for (let row of temp_rows) {
        row.content += "..."
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count;//博客条数
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
    console.log(res)
}

//读取分类
const loadCategorys = async () => {
    let res = await axios.get("/category/list")
    categortyOptions.value = res.data.rows.map((item) => {
        return {//使用 map 方法，您遍历了这个数组，并为每个分类数据项创建了一个新的对象，该对象包含了 label 和 value 两个属性。
            label: item.name,//label与value为ui组件库选择框配置格式要求
            value: item.id
        }
    })
    console.log(categortyOptions.value)
}
//提交按钮
const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
}
//跳转页数
const toPage = async (pageNum) => {
    pageInfo.page = pageNum
    loadBlogs()
}
//跳转修改按钮
const toUpdate = async (blog) => {
    tabValue.value = "update"
    let res = await axios.get("/blog/detail?id=" + blog.id)
    updateArticle.id = blog.id
    updateArticle.title = res.data.rows[0].title
    updateArticle.content = res.data.rows[0].content
    updateArticle.categoryId = res.data.rows[0].category_id
}
//修改提交
const update = async () => {
    let res = await axios.put("/blog/_token/update", updateArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        loadBlogs()
        tabValue.value = "list"
    } else {
        message.error(res.data.msg)
    }
}
//跳转删除
const toDelete = async (blog) => {
    let res = await axios.delete("/blog/_token/delete?id="+blog.id)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        loadBlogs()
    } else {
        message.error(res.data.msg)
    }
}
</script>

<style lang="scss">

</style>