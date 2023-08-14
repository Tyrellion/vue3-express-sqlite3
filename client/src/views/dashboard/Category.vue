<template>
  <div>
    <n-button @click="showAddModel = true">添加</n-button>
    <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>编号</th>
        <th>名称</th>
        <th>操作</th>
        <th>万事开头难</th>
      </tr>
    </thead>
    <tbody>
        <tr v-for="(category, index) in categoryList">
            <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space> 
                            <n-button @click="toUpdate(category)">修改</n-button>
                            <n-button @click="deleteCategory(category)">删除</n-button>
                        </n-space>
                    </td>
      </tr>
     
    </tbody>
  </n-table>

<!-- 弹出框 模态框-->
  <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
            <template #header>
                <div>添加分类</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="add">提交</n-button>
                </div>
            </template>
        </n-modal>

<!-- 弹出框 模态框-->
        <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
            <template #header>
                <div>修改分类</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="update">提交</n-button>
                </div>
            </template>
        </n-modal>


  </div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject,onMounted } from 'vue'

import { useRouter, useRoute } from 'vue-router'//使用路由
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
const adminStore = AdminStore()



const showAddModel = ref(false)//一开始不弹出添加页面
const showUpdateModel = ref(false)

const categoryList = ref([])//v-for展示数组
const addCategory = reactive({
    name:""
})
const updateCategory = reactive({
    id:0,
    name: ""
})
onMounted(()=>
    loadDatas()
)
//它会在组件被挂载到 DOM 后执行传入的函数
const loadDatas = async ()=>{
    let res = await axios.get("/category/list")
    categoryList.value = res.data.rows
}
//添加接口
const add = async () => {
    let res = await axios.post("/category/_token/add", { name: addCategory.name })
    if (res.data.code == 200) {
        loadDatas()//重新读取一次否则需要刷新才能看到更新页面
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showAddModel.value = false;//隐藏弹窗
}
//出现修改框
const toUpdate = async (category) =>{
    showUpdateModel.value = true 
    updateCategory.id = category.id
    updateCategory.name = category.name
}
//修改接口
const update = async ()=>{
    let res = await axios.put("/category/_token/update", { id:updateCategory.id, name: updateCategory.name })
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModel.value = false;
}
//删除按钮
const deleteCategory = async (category) => {
//dialog对话框删除时要点击确认才删除
dialog.warning({
    title: '警告',
    content: '是否要删除',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
        let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
        if (res.data.code == 200) {
            loadDatas()
            message.info(res.data.msg)
        } else {
            message.error(res.data.msg)
        }
    },
    onNegativeClick: () => { }
})


}
</script>

<style lang="scss">

</style>