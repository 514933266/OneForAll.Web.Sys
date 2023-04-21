<template>
  <div class="ofa-form">
    <el-card content-position="left" class="form-header" shadow="never">
      <el-page-header @back="goBack" content="机构管理 Tenant" size="mini"></el-page-header>
      <div class="button-box"><span v-if="disabled">
          <el-button round @click="disabled = false" type="primary" size="mini">
            <font-awesome-icon fas icon="edit"></font-awesome-icon>&nbsp;
            编辑
          </el-button>
        </span><span v-else>
          <el-button round @click="submit" type="primary" size="mini">
            <font-awesome-icon fas icon="save"></font-awesome-icon>&nbsp;
            保存
          </el-button>
          <el-button round v-show="!isAdd" @click="disabled = true" type="warning" size="mini">
            <font-awesome-icon fas icon="reply"></font-awesome-icon>&nbsp;
            取消
          </el-button>
        </span></div>
    </el-card>
    <div class="form-content">
      <el-card content-position="left" shadow="never">
        <div slot="header">
          <span class="card-header-label">基本信息</span>
        </div>
        <el-form status-icon ref="form" :rules="validationRules" :model="entity" class="form" label-width="120px">
          <el-form-item label="机构名称" prop="Name">
            <el-input v-model.trim="entity.Name" placeholder="企业的名称"></el-input>
          </el-form-item>
          <el-form-item label="信用代码" prop="Code">
            <el-input v-model.trim="entity.Code" placeholder="机构社会同一信用代码/自定义代码"></el-input>
          </el-form-item>
          <el-form-item label="管理人" prop="Manager">
            <el-input v-model.trim="entity.Manager" placeholder="企业管理者名称/负责人"></el-input>
          </el-form-item>
          <div class="row">
            <el-form-item label="是否启用">
              <el-switch v-model="entity.IsEnabled"></el-switch>
            </el-form-item>
            <el-form-item label="是否默认">
              <el-switch v-model="entity.IsDefault"></el-switch>
            </el-form-item>
          </div>
          <el-form-item label="联系电话" prop="Phone">
            <el-input v-model.trim="entity.Phone" placeholder="负责人联系方式"></el-input>
          </el-form-item>
          <el-form-item label="企业地址" prop="Address" class="address-item">
            <el-input class="address-textarea" placeholder="请输入具体地址，详细到门牌号" v-model="entity.Address"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="Description" class="description-item">
            <el-input type="textarea" class="description-textarea" placeholder="请输入企业简要介绍"
              v-model="entity.Description"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import API from '../../../apis/sys-api'
import { TENANT, TENANT_FORM } from '../../../router/sys-router'

export default {
  name: TENANT_FORM.name,
  data () {
    return {
      loading: false, // 加载中
      isAdd: false, // 是否添加
      disabled: true, // 允许编辑
      entity: {},
      validationRules: {
        Name: [{ required: true, message: '请先填写机构名称', trigger: 'blur' }, { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }],
        Manager: [{ max: 20, message: '不能超过20个字符', trigger: 'blur' }],
        Phone: [{ max: 20, message: '不能超过20个字符', trigger: 'blur' }],
        Code: [{ min: 0, max: 20, message: '长度不能超过50个字符', trigger: 'blur' }],
        Permissions: [{ required: true, message: '请先选择机构权限', trigger: 'blur' }]
      }
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
        this.entity = { IsEnabled: true, ...this.$route.params }
        if (!this.isAdd) {
          this.disabled = true
        } else {
          this.disabled = false
        }
        this.loading = false
      }
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) this.submitRemote()
      })
    },
    submitRemote () {
      if (this.entity.isAdd) {
        this.add()
      } else {
        this.update()
      }
    },
    add () {
      const url = this.$root.getApi(API.KEY, API.TENANT.URL)
      this.axios.post(url, this.entity)
        .then(response => {
          if (response.Status) {
            this.isAdd = false
            this.disabled = true
          }
        })
    },
    update () {
      const url = this.$root.getApi(API.KEY, API.TENANT.URL)
      this.axios.put(url, this.entity)
        .then(response => {
          if (response.Status) {
            this.disabled = true
          }
        })
    },
    goBack () {
      this.$refs.form.resetFields()
      this.$root.navigate({ ...TENANT, params: {} })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
$label-color:#99a9bf;
$border-color:#EBEEF5;

.ofa-form {
  /deep/ .tips {
    li {
      padding: 3px 0;
      font-size: .75rem;
    }
  }
}

/deep/ .form {

  input {
    width: 200px;
  }

  label {
    color: #99a9bf;
  }

  .address-textarea {
    .el-input,
    input {
      width: 600px !important;
    }
  }

  .description-textarea {
    width: 600px !important;
    height: 100px;
  }
}
</style>
