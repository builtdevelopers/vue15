/* eslint-disable no-unused-vars */
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
      <!--搜索框 和 添加按钮-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容"
                    v-model="queryParams.query"
                    :clearable="true"
                    @clear="getUserInfos"
                    @keyup.enter.native="getUserInfos">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary"
                     @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--数据列表展示区域-->
      <el-table :data="userInfos"
                border
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="60"></el-table-column>
        <el-table-column prop="username"
                         label="用户名"></el-table-column>
        <el-table-column prop="mobile"
                         label="手机号码"
                         width="140"></el-table-column>
        <el-table-column prop="role_name"
                         label="角色"
                         width="130"></el-table-column>
        <el-table-column prop="email"
                         label="邮箱"
                         width="150"></el-table-column>
        <el-table-column label="状态"
                         width="70">
          <el-switch v-model="info.row.mg_state"
                     slot-scope="info"></el-switch>
          <!--在此获得每个用户的信息，用户信息已经被插槽传递到此位置了，请自动接收即可
              每个用户数据具体是通过"row"关键字定义的
          -->
          <!-- <span slot-scope="info">{{info.row}}</span> -->
        </el-table-column>

        <el-table-column label="操作"
                         width="230">
          <el-button type="primary"
                     icon="el-icon-edit"
                     size="mini"
                     @click="delUser(info.row.id)">
          </el-button>
          <el-tooltip content="分配角色"
                      placement="top"
                      :enterable="false">
            <el-button type="warning"
                       icon="el-icon-setting"
                       size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
      <!--数据分页展示区域-->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryParams.pagenum"
                     :page-sizes="[3, 5, 10, 20]"
                     :page-size="queryParams.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="queryParams.total"></el-pagination>

      <!-- 添加用户的Dialog弹框区        -->

      <el-dialog title="添加用户"
                 :visible.sync="addDialogVisible"
                 width="50%"
                 @close="addDialogClose">
        <el-form :rules="addFromRules"
                 ref="addFromRef"
                 :model="addFrom"
                 lable-width="80px">
          <el-form-item label="用户名"
                        prop="username">
            <el-input v-model="addFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="addFrom.emial"></el-input>
          </el-form-item>
          <el-form-item label="手机号码"
                        prop="mobile">
            <el-input v-model="addFrom.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="editUser">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created () {
    this.getUserInfos()
  },
  methods: {
    // 修改用户相关1
    //接收信息入库存储
    async editUser () {
      // axios提交数据存储
      // 用户id 已经被存储赋予editForm.id 成员里边
      const { data: res } = await this.$http.put('users/' + this.editFrom.id, this.editFrom.id)    }
      if(res.meta.status!== 200){ return this.$message.error(res.meta.msg) }
      // 别修改信息用户完毕(关闭Dialog.成功提示.更新列表数据)
      this.editDialogVisble = false
      this.$message.success(res.meta.msg)
      this.getUserInfos();
// 展示修改用户的Diaalog
// @params id: 被修改用户id
async showEditDialog(id) {
  this.editDialogVisble = true
  //被修改用户的信息展示到form表单中
  //根据id查询被修改用户信息
  const { data: res } = awiat this.$http.get('users/' + id)

  if (res.meta.status !== 200) {
    return this.$message.error(res.meta.msg)
  }

  // 接收被修改用户信息
  this.editFrom = res.data
},
//  删除用户
delUser(id) {
  this.$confirm('确定要删除该会员吗?', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })

    .then(async () => {
      // axios 触发api接口删除
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) { return this.$message.error(res.meta.msga) }

      // 删除成功后： 提示 和 更新数据
      this.$message.sucess(res.meta.msg)
      this.getUserInfos()
    })
    .catch(() => { })
},
// 添加用户相关1
//收集用户信息存储到后端api的数据库中
adduser() {
  // 进行客户端form表单检验
  this.$refs.addFromRef.validate(async valid => {
    //检验成功的处理
    if (valid) {
      const { data: res } = awiat this.$http.post('users', this.addFrom)

      //提交不成功处理
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta)
      }

      // 提交不成功处理
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }

      // 关闭 Dialog.
    }
  })
},
addDialogclose() {
  // 重置from表单
  this.$refs.addFromrules.ressetFileds()
},
// 删除用户
delUser(id) {
  // 确认操作
  this.$confirm('确认要删除该会员吗?', '删除', {

  })
},
// 数据分页相关1
// 每页信息条数变化回调函数处理
handleSizeChange(val) {
  // val:代表变化后的每页信息显示条数
  this.queryParams.pagesize = val
  // 根据变化后的 显示条数 重新获得数据
  this.getUserInfos()
},
// 当前页码变化回调处理
handleCurrentChange(val) {
  // val:代表变化后的 页码
  this.queryParams.pagenum = val
  // 根据变化后的 页码 重新获得数据
  this.getUserInfos()
},
// 数据分页相关2

// 获得首屏用户数据
async getUserInfos() {
  const { data: res } = await this.$http.get('users', {
    params: this.queryParams
  })

  // 获取数据失败
  if (res.meta.status !== 200) {
    return this.$message.error(res.meta.msg)
  }
  // 丰富记录总条数变量
  this.queryParams.total = res.data.total
  // 把获得的用户数据 赋予给userInfos成员
  this.userInfos = res.data.users
}
  },
data() {
  // 自定义校验器
  // var checkMoble = (rule, value被校验数据，callback回调函数)=> {}
  var checkMobile = (rule, vaule, callback) => {
  }

  // 校验手机号码规则：13/5/7/8后接9位数字(一共11位)
  if (!/^1[35789]\d{9}$/.test(value)) {
    // 校验失败
    return callback(new Error('手机号码格式不正确'))
  }

  // 校验通过
  callback() // 继续执行
}
return {
  // 添加用户相关1
  // Dialog弹框是否显示 true:显示   false:隐藏
  addDialogVisble: false,
  // form表单数据部分
  addFrom: {
    username: '',
    password: '',
    email: '',
    mobile: ''
  },
  // from表单检验规则制作
  addFromrules: {
    username: [
      { required: true, message: '用户名必填', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '密码必填', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '手机号码必填', trigger: 'blur' },
      // { vaildator: 自定义校验器， trigger: 'blur'}
      { validator: checkMobile, trigger: 'blur' }
    ]
  },
  // 接收用户数据
  userInfos: [],
  // 定义获取用户数据时用到的查询条件参数
  queryParams: {
    query: '', // 用户关键字搜索使用
    pagenum: 1, // 当前页码
    pagesize: 3, // 每页显示条数
    total: 0 // 记录总条数
  }
}
}
}
</script>

<style lang="less" scoped>
</style>
