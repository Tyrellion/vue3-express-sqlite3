<template>
  <div class="main-panel">
    <div class="menus">
        <div v-for="(menu, index) in menus" @click="toPage(menu,index)" 
        :class="{ 'selected': selectedMenuIndex === index }"><!-- 通过赋值v-for元素类名的方法实现了后台点击后变色的效果 -->
                {{ menu.name }}
            </div>
        </div>
        <!-- 下面为显示内容的右侧大面积 -->
        <div style="padding:20px;width:100%">
            <router-view></router-view>
        </div>
  </div>
  <div class="title">后台管理系统</div>

</template>

<script setup>
import { color } from 'echarts';
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject } from 'vue'

import { useRouter, useRoute } from 'vue-router'//使用路由
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const adminStore = AdminStore()


const selectedMenuIndex = ref(-1); // 记录选中的菜单索引，默认为-1
//菜单
let menus = [
    { name: "文章管理", href: "/dashboard/article" },
    { name: "分类管理", href: "/dashboard/category" },
    { name: "用户界面", href: "/" },
    { name: "退出", href: "logout" },
];
//路由跳转
const toPage = (menu,index) => {
    selectedMenuIndex.value = index
    if (menu.href == 'logout') {
        router.push("/login")
    } else {
        router.push(menu.href)
    }
}
</script>

<style lang="scss" scoped>

.main-panel {
    display: flex;
    color: #64676a;
    max-width: 1500px;
    margin: 0 auto;
}
.menus {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;

    div {//sass语法
        cursor: pointer;

        &:hover {
            color: #fd760e;
        }
    }
}
.title {
    font-size: 65px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0, 0, 0, 20%);
    right: calc((100vw - 1500px) / 2);
    bottom: 20px;
}
.selected {
    color: #fd760e; /* 设置选中菜单的颜色 */
  }
</style>