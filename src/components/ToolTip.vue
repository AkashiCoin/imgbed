<template>
    <div class="head" @mouseleave="restore()">
        <div class="iconDiv" :class="{active:showIndex == 0 ? true : false }" tooltip="首页" tabindex="0" @click="changePage(0)" @mouseover="showText(0)" >
            <div class="iconSVG">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
        <div class="spacer"></div>
        <div class="divider"></div>
        <div class="iconDiv" :class="{active:showIndex == 1 ? true : false }" tooltip="自定义上传" tabindex="1" @click="changePage(1)" @mouseover="showText(1)" >
            <div class="iconSVG">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16 v 1 a 3 3 0 003 3 h 10 a 3 3 0 003 -3 v -1  m -8 -12 l 4 4  m -4 -4 l -4 4 m 4 7 V4" />
                </svg>
            </div>
        </div>
        <div class="iconDiv" :class="{active:showIndex == 2 ? true : false }" tooltip="自定义下载" tabindex="2" @click="changePage(2)" @mouseover="showText(2)" >
            <div class="iconSVG">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1 m -4 -4 l -4 4 m0 0l-4-4m4 4V4" />
                </svg>
            </div>
        </div>
        <div class="spacer"></div>
        <div class="divider"></div>
        <div class="iconDiv" :class="{active:showIndex == 3 ? true : false }" tooltip="管理分享" tabindex="3" @click="changePage(3)" @mouseover="showText(3)" >
            <div class="iconSVG">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 256 256" stroke="currentColor" stroke-width="1">
                    <path fill="currentColor" d="M176 164a35.9 35.9 0 0 0-27.9 13.3L96.2 144a35.6 35.6 0 0 0 0-32l51.9-33.3a36.4 36.4 0 1 0-4.3-6.7l-51.9 33.3a36 36 0 1 0 0 45.4l51.9 33.3a36 36 0 1 0 32.2-20Zm0-136a28 28 0 1 1-28 28a28.1 28.1 0 0 1 28-28ZM64 156a28 28 0 1 1 28-28a28.1 28.1 0 0 1-28 28Zm112 72a28 28 0 1 1 28-28a28.1 28.1 0 0 1-28 28Z"/>
                </svg>
            </div>
        </div>
        <div class="iconDiv" :class="{active:showIndex == 4 ? true : false }" tooltip="本地管理" tabindex="4" @click="changePage(4)" @mouseover="showText(4)" >
            <div class="iconSVG">
                <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, onMounted, ref, watch, watchEffect} from "vue";
import { useRouter , useRoute } from 'vue-router'
export default defineComponent({
    name: "tool-tip",
    setup(){
        let showIndex = ref(0);
        let activeIndex = ref(0);
        const router = useRouter();
        const route = useRoute();

        function refreshActiveIndex(){
            let rPath  = route.path;
            if( rPath == "/"){
                activeIndex.value = 0;
            }
            if( rPath == "/upload"){
                activeIndex.value = 1;
            }
            if( rPath == "/download"){
                activeIndex.value = 2;
            }
            if( rPath == "/manager/share"){
                activeIndex.value = 3;
            }
            if( rPath == "/manager/local"){
                activeIndex.value = 4;
            }
            
            showIndex.value = activeIndex.value;
        };

        function changePage(tabindex){
            if(tabindex == 0){
                router.push({ name: "首页", replace: true});
            }
            if(tabindex == 1){
                router.push({ name: "上传", replace: true});
            }
            if(tabindex == 2){
                router.push({ name: "下载", replace: true});
            }
            if(tabindex == 3){
                router.push({ name: "分享文件管理", replace: true});
            }
            if(tabindex == 4){
                router.push({ name: "本地文件管理", replace: true});
            }
        };
        function showText(hoverDom){
            showIndex.value = hoverDom;
        };
        function restore(){
            showIndex.value = activeIndex.value;
        };
        onMounted(() => {
            refreshActiveIndex();
        });

        watch(route, () => {
            refreshActiveIndex();
        });

        return {
            showIndex,
            activeIndex, 
            refreshActiveIndex,
            changePage,
            showText,
            restore
        };
    },
});
</script>
<style  scoped>
    @property --rotate {
        syntax: "<angle>";
        initial-value: 132deg;
        inherits: false;
    }
    .head {
        position: relative;
        padding: 0 16px;
        display: flex;
        border: 1px solid var(--color-dark);
        border-radius: 16px;
        width: 420px;
        --color-light: rgb(203 213 225);
        --color-mid: rgb(51 65 85);
        --color-dark: rgb(71 85 105);
        background: #191c29;
    }
    .head::before {
        content: "";
        --rotate: 0deg;
        width: calc(100% + 6px);
        height: calc(100% + 6px);
        border-radius: 16px;
        background-image: linear-gradient(
            var(--rotate)
            , #5ddcff, #3c67e3 43%, #4e00c2);
        position: absolute;
        z-index: -1;
        top: -3px;
        left: -3px;
        animation: spin 2.5s linear infinite;
        transition: all .3s;
    }
    .head:hover:before {
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        animation: none;
    }
    .iconDiv {
        height: 36px;
        width: 36px;
        margin-top: 20px;
        margin-bottom: 20px;
        margin-left: 4px;
        padding: 4px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        cursor: pointer;
        transition: width 300ms ease-in-out 0s, background-color 300ms linear 200ms;
    }
    .iconSVG {
        height: 36px;
        aspect-ratio: 1 / 1;
        color: rgb(88 199 250 / 100%);
    }
    .iconDiv:hover,
    .iconDiv:focus-visible {
        width: 142px;
        background-color: var(--color-mid);
        transition: width 300ms ease-in-out 0s, background-color 100ms linear 0s;
    }
    .active{
        width: 142px;
        background-color: var(--color-mid);
        transition: width 300ms ease-in-out 0s, background-color 100ms linear 0s;
    }
    .iconDiv:active {
        opacity: 0.9;
    }
    .iconDiv::after {
        content: attr(tooltip);
        margin-left: 12px;
        animation: fadeIn 600ms linear forwards;
        color: rgb(88 199 250 / 100%);
    }
    .spacer {
        flex-grow: 1;
    }
    .divider {
        height: 36px;
        width: 1px;
        margin: 24px 18px;
        background-color: var(--color-dark);
    }

    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes spin {
        0% {
            --rotate: 0deg;
        }
        100% {
            --rotate: 360deg;
        }
    }
</style>
