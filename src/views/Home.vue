<template>
  <el-container>
    <el-header class="homeHeader">
      <h2 class="title">免费文件分享</h2>
    </el-header>
    <el-main>
      <div class="main">
        <p><router-link class="router-link" to="/"> 首页 </router-link></p>
        <p><router-link class="router-link" to="/upload"
          >上传<i class="el-icon-upload el-icon--right"></i>
        </router-link></p>
        <p><router-link class="router-link" to="/download"
          >下载<i class="el-icon-download el-icon--right"></i>
        </router-link></p>
        <p><router-link class="router-link" to="/manager/share"
          >管理分享<i class="el-icon-setting el-icon--right"></i>
        </router-link></p>
        <p><router-link class="router-link" to="/manager/local"
          >本地管理<i class="el-icon-setting el-icon--right"></i>
        </router-link></p>
      </div>
    </el-main>
    <div class="footer">
      <el-link
        href="https://github.com/AkashiCoin"
        type="success"
        target="_blank"
        >Github</el-link
      > | 
      <el-link type="success">
        <router-link to="/manager/local" style="color: #409eff; text-decoration: none"
          >管理
        </router-link>
      </el-link>
    </div>
  </el-container>
</template>

<style scoped>
/* .homeHeader {
    position: relative;
    background-color: #409eff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 15px;
    box-sizing: border-box;
} */
.el-main {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  padding: 0 !important;
  min-height: calc(95vh - 60px);
}
.router-link {
  width: min(100px, 88vw);
  display: inline-block;
  padding: 6px 18px;
  margin-bottom: 0;
  border-radius: 5px;
  color: black;
  text-decoration: none;
  background-color: #409eff;
}
.main {
  width: min(844px, 88vw);
  padding: 15px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
