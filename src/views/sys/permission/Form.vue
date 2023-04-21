<template>
  <div class="ofa-form">
    <el-card content-position="left" class="form-header" shadow="never">
      <el-page-header @back="goBack" content="权限管理 Permission" size="mini"></el-page-header>
      <div class="button-box">
        <span v-if="disabled">
          <el-button round @click="disabled = false" type="primary" size="mini">
            <font-awesome-icon fas icon="edit"></font-awesome-icon>&nbsp;编辑
          </el-button>
        </span>
        <span v-else>
          <el-button round @click="submit" type="primary" size="mini">
            <font-awesome-icon fas icon="save"></font-awesome-icon>&nbsp;保存
          </el-button>
          <el-button round v-show="!isAdd" @click="disabled = true" type="warning" size="mini">
            <font-awesome-icon fas icon="reply"></font-awesome-icon>&nbsp;取消
          </el-button>
        </span>
      </div>
    </el-card>
    <div class="form-content">
      <el-card content-position="left" shadow="never">
        <div slot="header">
          <span class="card-header-label">基本信息</span>
        </div>
        <el-form status-icon :model="entity" :rules="validationRules" :disabled="disabled" ref="form" class="form"
          size="mini">
          <div class="row">
            <el-form-item label="所属菜单" prop="MenuId" class="menu-item">
              <menu-cascader v-model="entity.MenuId" placeholder="请选择所属菜单"></menu-cascader>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="名称" prop="Name">
              <el-input v-model.trim="entity.Name" placeholder="请输入权限名称"></el-input>
            </el-form-item>
            <el-form-item label="代码" prop="Code">
              <el-input v-model.trim="entity.Code" placeholder="请输入权限代码"></el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="备注" prop="Remark" class="remark-item">
              <el-input show-word-limit v-model="entity.Remark" type="textarea" maxlength="100" class="remark-textarea"
                placeholder="请输入权限备注">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import API from '../../../apis/sys-api'
import { PERMISSION, PERMISSION_FORM } from '../../../router/sys-router'
import MenuCascader from '../_components/MenuCascader'

// 系统权限表单
export default {
  name: PERMISSION_FORM.name,
  data () {
    return {
      loading: false, // 加载中
      isAdd: false, // 是否添加
      disabled: true, // 允许编辑
      entity: {},
      validationRules: {
        Name: [{ required: true, message: '请先填写权限名称', trigger: 'blur' }, { min: 2, max: 20, message: '长度在2~20之间', trigger: 'blur' }],
        Code: [{ required: true, message: '请先填写权限代码', trigger: 'blur' }, { min: 2, max: 50, message: '长度在2~50之间', trigger: 'blur' }],
        MenuId: [{ required: true, message: '请先选择所属菜单', trigger: 'blur' }]
      }
    }
  },
  computed: {
    permissions () {
      return this.$root.getPermissions(PERMISSION.name)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.init())
  },
  methods: {
    init () {
      if (!this.loading) {
        this.loading = true
        this.tenants = []
        this.isAdd = this.$route.params.isAdd
        this.entity = { ...this.$route.params }
        if (!this.isAdd) {
          this.disabled = true
        } else {
          this.disabled = false
        }
        this.loading = false
      }
    },
    submit () {
      if (this.saving) return
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.entity.isAdd) {
            this.add()
          } else {
            this.update()
          }
        }
      })
    },
    add () {
      const url = this.$root.getApi(API.KEY, API.PERMISSION.URL)
      this.axios.post(url, this.entity)
        .then(response => {
          if (response.Status) this.goBack()
        })
    },
    update () {
      const url = this.$root.getApi(API.KEY, API.PERMISSION.URL)
      this.axios.put(url, this.entity)
        .then(response => {
          if (response.Status) {
            this.disabled = true
          }
        })
    },
    goBack () {
      this.$refs.form.resetFields()
      this.$root.navigate({ ...PERMISSION, params: {} })
    }
  },
  created () {
    this.init()
  },
  components: { MenuCascader }
}
</script>

<style lang="scss" scoped>
.ofa-form {
  /deep/ .tips {
    li {
      padding: 3px 0;
      font-size: .75rem;
    }
  }

  /deep/ .form {

    .menu-item {
      flex: 1;
      max-width: 420px;

      .el-cascader,
      .el-input {
        width: 100%;
      }
    }

    .remark-item {
      flex: 1;
      max-width: 420px;

      .remark-textarea,
      textarea {
        width: 100%;
        height: 100px;
      }
    }
  }
}
</style>
