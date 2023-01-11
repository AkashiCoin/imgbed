<template>
    <div id="bg">
        <svg width="100%" height="100%">
            <mask id="m">
                <circle id="c1" cx="40" cy="40" r="0" fill="#fff"/>
                <circle id="c0" cx="40" cy="40" r="0" fill="#fff" opacity="0.5"/>      
            </mask>
            
            <g id="imgFg">
                <defs>
                    <linearGradient y2="1" x2="1" y1="0" x1="0" id="imgFg_img">
                    <stop stop-color="#a0b3d6" offset="0"/>
                    <stop stop-color="#34538b" offset="1"/>
                    </linearGradient>
                </defs>
                <g>
                    <rect id="imgFg_box" width="100%" height="100%" y="0" x="0" fill="url(#imgFg_img)"/>
                </g>
            </g>    
            <g id="imgBg" mask="url(#m)" ref="imgBg"></g>
        </svg>
    </div>
</template>
<script>
    import { gsap } from "gsap";
    export default {
        name: "BackgroudLoad",
        data() {
            return {};
        },
        mounted() {
            this.loadding();
        },
        methods: {
            loadding() {
                const pos = {x: innerWidth * Math.random(), y: innerHeight * Math.random()}
                gsap.to('circle', {duration:0.3, attr:{cx:pos.x, cy:pos.y}})
                let newImg = new Image();
                newImg.src = 'https://random-img.smoe.top/';
                newImg.onload = () => { 
                    const img = document.createElementNS("http://www.w3.org/2000/svg", "image")
                    this.$refs.imgBg.appendChild(img)
                    gsap.set(img, {attr:{x:'0', y:'0', width:'100%', height:'100%', href:newImg.src, preserveAspectRatio:'xMidYMid slice'}})
                    gsap.to('circle', {duration:0.3, attr:{r:(i)=>[30,50][i]}})
                    gsap.to(imgFg.children[1], {
                        attr:{
                        x:gsap.utils.interpolate('0%','-10%',pos.x/innerWidth),
                        y:gsap.utils.interpolate('0%','-10%',pos.y/innerHeight)  
                        }
                    })

                    gsap.timeline()
                        .to('circle', {duration:0.4, attr:{r:innerWidth}, ease:'power3.in', stagger:-0.1})
                        .add(()=>{
                            imgFg.append(imgBg.children[imgBg.children.length-1])
                            gsap.set('circle', {attr:{r:0}})
                    })
                }
            }
        },
    };
</script>
<style  scoped>
    #bg{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100vh;
        /* background: radial-gradient(circle, mediumturquoise, darkslateblue); */
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        z-index: -1;
    }
    #bg::after {
        content: '';
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        background-image: url(../assets/img/dot.gif);
        background-attachment: fixed;
    }
    svg {
        position:fixed;  
        top: 0;
        left: 0;
        z-index: -1;
    }
</style>
