import { createRouter, createWebHashHistory } from "vue-router";//在 hash 模式下，路由信息会以 URL 中的 hash 符号（#）来表示。例如，路由路径为 /home，在 hash 模式下会显示为 /#/home。

let routes = [
    { path: "/test", component: () => import("../views/Test.vue") },//使用动态导入可以实现按需加载（懒加载）组件，这样可以提高应用程序的性能，只在需要时才加载对应的组件，而不是一次性加载所有组件。
    { path: "/", component: () => import("../views/HomePage.vue") },
    { path: "/detail", component: () => import("../views/Detail.vue") },
    { path: "/login", component: () => import("../views/Login.vue") },
    {path:"/dashboard",component: ()=>import("../views/dashboard/Dashboard.vue"),children:[
        { path: "/dashboard/category", component: () => import("../views/dashboard/Category.vue") },
        { path: "/dashboard/article", component: () => import("../views/dashboard/Article.vue") },
    ]}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export { router, routes };
