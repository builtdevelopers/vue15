<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--内容卡片区-->
    <el-card class="box-card">
      <!--数据列表展示区域-->
      <el-table :data="rightsIfos"
                border
                style="width: 100%">
        <el-table-column type="date"
                         label="序号"
                         width="60"></el-table-column>
        <el-table-column prope="name"
                         label="名称"></el-table-column>
        <el-table-column prope="address"
                         label="路径"
                         width="120"></el-table-column>
        <el-table-column prope="address"
                         label="地址"
                         width="130"></el-table-column>
        <template slot-scope="info">
          <el-tag v-if="info.row.level==0">一级</el-tag>
          <el-tag v-else-if="info.row.level==1"
                  type="success">二级</el-tag>
          <el-tag v-else
                  type="waring">三级</el-tag>
        </template>

      </el-table>
    </el-card>
    <div>
</template>

<script>
export default {
  //生命周期函数
  created () {
    this.getRightsInfo()
  },
  methods: {
    // 获取用于显示的权限列表信息
    async getRightsInfo () {
      const { data: res = await this.$message.error(res.meta.msg) }

      // 把获的的权限数据赋予给rightsInfo成员
      this.rightInfos = res.data
    }
  },
  data () {
    return {
      // 权限列表数量
      rightInfos: []
    }
  }
}
</script>

<style lang="less" scoped>
</style>








//生命周期来执行
