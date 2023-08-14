<template>
  <div>
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, inject, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject("server_url")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
const toolbarConfig = { excludeKeys:["uploadVideo"] };//去除上传视频功能
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {}
//上传图片地址
editorConfig.MENU_CONF['uploadImage'] = {
    base64LimitSize: 10 * 1024, //  用于设置上传的图片的 base64 编码的大小限制，这里设置为 10 * 1024，即 10KB。
    server: server_url+'/upload/rich_editor_upload',
}
//插入图片前操作
editorConfig.MENU_CONF['insertImage'] ={
    parseImageSrc:(src) =>{
        if(src.indexOf("http") !==0){
            return `${server_url}${src}`
        }
        return src
    }
}
const mode = ref("default")
const valueHtml = ref("")


const props = defineProps({//此页面为接收页面
    modelValue: {//addArticle.content 传递给 rich-text-editor 子组件的 modelValue prop，
        type: String,
        default: ""
    }
})

const emit = defineEmits(["update:model-value"])//声明了一个自定义事件名为 "update:model-value"
let initFinished = false

onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initFinished = true;
    }, 200);
});
// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    if (initFinished) {
        emit("update:model-value", valueHtml.value)//第一个参数是自定义事件的名称 "update:model-value"，这个名称与您在 defineEmits 中声明的事件名称相对应。第二个参数是要传递给父组件的数据，这里使用了 valueHtml.value，即编辑器的内容。
    }
};
</script>

<style>

</style>