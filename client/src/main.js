import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'//引入独立api方便使用message组件
import {router} from './common/router'
import { createPinia } from 'pinia'
import axios from 'axios'
import { AdminStore } from './stores/AdminStore'//拦截器要用
axios.defaults.baseURL = 'http://localhost:8080'//http://localhost:8080。这意味着在使用 Axios 发送请求时，如果没有指定完整的 URL，那么请求将会以 http://localhost:8080 作为基础 URL 进行请求。
const { message, notification, dialog } = createDiscreteApi(['message', 'dialog', 'notification'])



//createApp(App).mount('#app')//createApp 函数创建了一个新的 Vue 应用实例，使用 mount 方法将这个 Vue 应用实例挂载到 HTML 页面中具有 ID 为 "app" 的元素上。这是应用程序将会渲染的地方。

const app = createApp(App)

app.provide("axios",axios)//是在 Vue 3 中使用 Composition API 提供全局依赖的一种方式。它用于将一个实例或值注册为全局依赖项，从而使得整个应用程序中的所有组件都可以访问这个依赖项。//避免了在每个组件中重复导入 axios 的繁琐工作
app.provide("server_url", axios.defaults.baseURL )//8080这个地址全局可调用
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)

app.use(naive)
app.use(createPinia())
app.use(router)

//拦截器给请求加token
const adminStore = AdminStore() 
axios.interceptors.request.use((config)=>{//替代{headers:{token:adminStore.token}} 
    config.headers.token = adminStore.token
    return config
})
app.mount('#app')