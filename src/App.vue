<template>
    <el-container>
        <el-header>
            <el-row>
                <el-col :span="8" class="rightsection">
                    <router-link to="/"> 首页 </router-link> |
                    <router-link to="/upload"> 上传 </router-link> |
                    <router-link to="/download"> 下载 </router-link>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <router-view />
        </el-container>
    </el-container>
</template>