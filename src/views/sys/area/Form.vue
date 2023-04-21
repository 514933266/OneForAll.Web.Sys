<template>
  <div class="ofa-form">
    <el-card content-position="left" class="form-header" shadow="never">
      <el-page-header @back="goBack" content="中国地区 Areas"></el-page-header>
      <div class="button-box">
        <span v-if="disabled">
          <el-button round @click="disabled = false" type="primary">
            <font-awesome-icon fas icon="edit"></font-awesome-icon>&nbsp;编辑
          </el-button>
        </span>
        <span v-else>
          <el-button round @click="submit" type="primary">
            <font-awesome-icon fas icon="save"></font-awesome-icon>&nbsp;保存
          </el-button>
          <el-button round v-show="!isAdd" @click="disabled = true" type="warning">
            <font-awesome-icon fas icon="reply"></font-awesome-icon>&nbsp;取消
          </el-button>
        </span>
      </div>
    </el-card>
    <div class="form-content">
      <el-form status-icon ref="form" :rules="validationRules" :model="entity" :disabled="disabled" class="form"
        label-width="80px">
        <el-card content-position="left" shadow="never">
          <div slot="header">
            <span class="card-header-label">基本信息</span>
          </div>
          <el-alert show-icon title="操作提示" type="warning" style="margin-bottom: 20px;">
            <ul class="tips">
              <li>如不了解此页面相关内容规则，请先咨询开发人员</li>
              <li>1. 填写此处内容前请先咨询开发人员，代码规则为上级代码叠加2位数字，如0101</li>
            </ul>
          </el-alert>
          <el-form-item v-if="entity.isAdd" label="上级地区" prop="ParentId">
            <system-area-cascader showRoot ref="tree" placeholder="请选择上级地区" v-model="entity.ParentId" size="mini">
            </system-area-cascader>
          </el-form-item>
          <el-form-item label="名称" prop="Name">
            <el-input v-model.trim="entity.Name" placeholder="请输入地区名称" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="代码" prop="Code">
            <el-input v-model.trim="entity.Code" placeholder="请输入地区代码" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="简称" prop="ShortName">
            <el-input v-model.trim="entity.ShortName" placeholder="请输入行政地区的简称，如：粤" size="mini"></el-input>
          </el-form-item>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script>
import API from '../../../apis/sys-api'
import { AREA, AREA_FORM } from '../../../router/sys-router'
import SystemAreaCascader from '../_components/AreaCascader'

export default {
  name: AREA_FORM.name,
  data () {
    return {
      loading: false, // 加载中
      isAdd: false, // 是否添加
      disabled: true, // 允许编辑
      code: '', //            用来
      entity: {},
      validationRules: {
        Name: [{ required: true, message: '请先填写地区名称', trigger: 'blur' }, { min: 2, max: 20, message: '长度在2~20之间', trigger: 'blur' }],
        Code: [{ required: true, message: '请先填写地区代码', trigger: 'blur' }, { min: 2, max: 50, message: '长度在2~20之间', trigger: 'blur' }],
        ParentId: [{ required: true, message: '请先选择上级', trigger: 'blur' }]
      }
    }
  },
  computed: {
    permissions () {
      return this.$root.getPermissions(AREA.name)
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
        this.entity = { ParentId: 0, Code: '', ...this.$route.params }
        this.code = this.entity.Code.length >= 2 ? this.entity.Code.substring(0, this.entity.Code.length - 2) : ''
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
      const url = this.$root.getApi(API.KEY, API.AREA.URL)
      this.axios.post(url, this.entity)
        .then(response => {
          if (response.Status) {
            this.goBack()
          }
        })
    },
    update () {
      const url = this.$root.getApi(API.KEY, API.AREA.URL)
      this.axios.put(url, this.entity)
        .then(response => {
          if (response.Status) {
            this.disabled = true
          }
        })
    },
    goBack () {
      this.$refs.form.resetFields()
      this.$root.navigate({ ...AREA, params: {} })
    }
  },
  created () {
    this.init()
  },
  components: { SystemAreaCascader }
}
</script>

<style lang="scss" scoped>
$label-color:#99a9bf;
$border-color:#EBEEF5;

.ofa-form {
  .tips {
    li {
      padding: 3px 0;
      font-size: .75rem;
    }
  }
}
</style>
