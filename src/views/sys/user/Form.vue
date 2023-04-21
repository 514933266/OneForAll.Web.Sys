<template>
  <div class="ofa-form">
    <el-card content-position="left" class="form-header" shadow="never">
      <el-page-header @back="goBack" content="机构用户 User" size="mini"></el-page-header>
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
      <el-form status-icon ref="form" :rules="validationRules" :model="entity" :disabled="disabled" class="form" label-width="80px"
        size="mini">
        <el-card content-position="left" shadow="never">
          <div slot="header">
            <span class="card-header-label">基本信息</span>
          </div>
          <el-alert show-icon title="操作提示" type="warning" style="margin-bottom:20px;">
            <ul class="tips">
              <li>1. 默认用户不可删除，权限和机构同步</li>
              <li>2. 初始密码与账号相同</li>
            </ul>
          </el-alert>
          <div class="row">
            <el-form-item label="是否默认">
              <el-switch v-model="entity.IsDefault"></el-switch>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="所属机构" prop="TenantId">
              <el-select filterable remote v-model="entity.TenantId" :remote-method="getTenants"
                placeholder="请输入机构名称进行查询">
                <el-option v-for="item in tenants" :key="item.Id" :label="item.Name" :value="item.Id">
                  <span class="float-left">{{item.Name}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="账号" prop="UserName">
              <el-input v-model.trim="entity.UserName" placeholder="请输入用户账号">
              </el-input>
            </el-form-item>
          </div>
          <div class="row">
            <el-form-item label="名称" prop="Name">
              <el-input v-model.trim="entity.Name" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="Status">
              <el-select v-model="entity.Status" placeholder="请选择账号初始状态">
                <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script>
import API from '../../../apis/sys-api'
import { NOT_ALLOWED, SUCCESS } from '../../../untils/error'
import { USER, USER_FORM } from '../../../router/sys-router'

export default {
  name: USER_FORM.name,
  data () {
    return {
      loading: false, // 加载中
      isAdd: false, // 是否添加
      disabled: true, // 允许编辑
      entity: {},
      tenants: [],
      types: [{ value: SUCCESS, label: '正常' }, { value: NOT_ALLOWED, label: '封禁' }],
      validationRules: {
        TenantId: [{ required: true, message: '请先选择用户所属机构', trigger: 'change' }],
        Name: [{ required: true, message: '请先填写用户名称', trigger: 'blur' }, { min: 2, max: 20, message: '长度在2到8个字符', trigger: 'blur' }],
        UserName: [{ required: true, message: '请先填写用户登录账号', trigger: 'blur' }, { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    permissions () {
      return this.$root.getPermissions(USER.name)
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
        this.entity = { IsDefault: true, Status: 1, ...this.$route.params }
        if (!this.isAdd) {
          this.disabled = true
          this.getTenant(this.entity.TenantId)
        } else {
          this.disabled = false
        }
        this.loading = false
      }
    },
    getTenant (id) {
      const url = this.$root.getApi(API.KEY, API.TENANT.URL)
      this.axios.get(`${url}/${id}`)
        .then(response => {
          this.tenants = [response]
        })
    },
    getTenants (key) {
      const url = this.$root.getApi(API.KEY, API.TENANT.URL)
      this.axios.get(`${url}/1/10`, {
        params: {
          key: key
        }
      }).then(response => {
        this.tenants = response.Items
      })
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            this.add()
          } else {
            this.update()
          }
        }
      })
    },
    add () {
      const url = this.$root.getApi(API.KEY, API.USER.URL)
      this.axios.post(url, this.entity)
        .then(response => {
          if (response.Status) {
            this.goBack()
          }
        })
    },
    update () {
      const url = this.$root.getApi(API.KEY, API.USER.URL)
      this.axios.put(url, this.entity)
        .then(response => {
          if (response.Status) {
            this.disabled = true
          }
        })
    },
    goBack () {
      this.$refs.form.resetFields()
      this.$root.navigate({ ...USER, params: {} })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
