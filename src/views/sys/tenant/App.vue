<template>
  <div class="ofa-container column">
    <el-card shadow="never">
      <div class="ofa-work-box">
        <span>
          <el-button type="primary" size="mini" @click="add">
            <font-awesome-icon fas icon="plus"></font-awesome-icon>&nbsp;新增
          </el-button>
        </span>
        <span>
          <el-button type="primary" @click="searchVisiable = true" size="mini">
            <font-awesome-icon fas icon="search"></font-awesome-icon>&nbsp;查询
          </el-button>
        </span>
      </div>
    </el-card>
    <el-card shadow="never" class="table-card">
      <el-table border :data="list" v-loading="loading" size="mini" class="ofa-table">
        <el-table-column width="50" align="center">
          <template slot-scope="scope">{{ scope.$index + 1 + (pageIndex - 1) * pageSize }}</template>
        </el-table-column>
        <el-table-column prop="Name" label="企业名称" min-width="250px"></el-table-column>
        <el-table-column prop="Code" label="机构代码" min-width="200px"></el-table-column>
        <el-table-column prop="Manager" label="联系人"></el-table-column>
        <el-table-column prop="Phone" label="联系方式"></el-table-column>
        <el-table-column label="注册日期" width="150" align="center">
          <template slot-scope="scope">{{ new Date(scope.row.CreateTime).toString('yyyy年MM月dd日') }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="IsEnabled" align="center" header-align="center" width="100">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.IsEnabled ? '启用中' : '已禁用'" placement="top">
              <el-button type="text">
                <font-awesome-icon fas icon="circle"
                  :class="['updateIsEnabled-icon', scope.row.IsEnabled?'ofa-text-success': 'ofa-text-danger']">
                </font-awesome-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="update(scope.row)">修改</el-button>
            <el-button type="text" size="mini" @click="toServicePage(scope.row)">管理</el-button>
            <el-button type="text" class="ofa-text-danger" size="mini" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" @size-change="pageSizeChange"
        @current-change="pageIndexChange" size="mini">
      </el-pagination>
      <!-- 查询条件 -->
      <el-drawer :visible.sync="searchVisiable" :modal="false" :show-close="false" direction="rtl" size="360px"
        class="ofa-drawer">
        <div class="title" slot="title">
          <span>搜索条件</span> <label class="ofa-text-primary">Search</label>
        </div>
        <div class="body">
          <el-form label-width="60px" class="form">
            <el-form-item label="状态">
              <el-select v-model="searchOption.isEnabled" size="mini">
                <el-option :value="-1" label="全部"></el-option>
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字">
              <el-input v-model="searchOption.key" size="mini" placeholder="请根据选择的类型输入关键字">
              </el-input>
            </el-form-item>
            <el-form-item label="开始日期">
              <el-date-picker v-model="searchOption.startDate" @change="get" type="date" class="date-picker" size="mini"
                placeholder="请选择注册开始日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期">
              <el-date-picker v-model="searchOption.endDate" @change="get" type="date" class="date-picker" size="mini"
                placeholder="请选择注册结束日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="footer">
          <el-button type="primary" @click="search">
            <font-awesome-icon fas icon="search"></font-awesome-icon>&nbsp;查询
          </el-button>
        </div>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
import API from '../../../apis/sys-api'
import { TENANT, TENANT_FORM, TENANT_SERVICE } from '../../../router/sys-router'

export default {
  name: TENANT.name,
  data () {
    return {
      loading: false, // 加载中
      searchVisiable: false, // 查询弹窗显示
      entity: {}, // 当前选中实体
      list: [],
      total: 1,
      pageIndex: 1,
      pageSize: 10,
      searchOption: {
        isEnabled: -1, // 合作状态
        key: '', // 关键字
        startDate: '', // 注册日期（开始）
        endDate: '' // 注册日期（结束）
      }
    }
  },
  computed: {
    permissions () {
      return this.$root.getPermissions(TENANT.name)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.init())
  },
  methods: {
    init () {
      if (this.loading) return
      this.get()
    },
    get () {
      this.loading = true
      const url = this.$root.getApi(API.KEY, API.TENANT.URL)
      this.axios.get(`${url}/${this.pageIndex}/${this.pageSize}`, {
        params: this.searchOption
      }).then(response => {
        this.total = response.Total
        this.list = response.Items
        this.loading = false
      })
    },
    pageSizeChange (value) {
      this.pageSize = value
      this.$nextTick(() => this.get())
    },
    pageIndexChange (value) {
      this.pageIndex = value
      this.$nextTick(() => this.get())
    },
    search () {
      this.pageIndex = 1
      this.$nextTick(() => this.get())
    },
    add () {
      this.toFormPage({ isAdd: true })
    },
    update (entity) {
      this.toFormPage(entity)
    },
    del (entity) {
      if (!this.checkHadSelection()) return false
      this.$confirm('确认要删除选中机构？删除后不可恢复，请谨慎操作！', '温馨提示', {
        type: 'warning',
        cancelButtonText: '放弃操作'
      }).then(() => {
        const url = this.$root.getApi(API.KEY, API.TENANT.BATCH_DELETE)
        this.axios.patch(url, [entity.Id]).then(response => {
          if (response.Status) this.get()
        })
      })
    },
    toFormPage (params) {
      this.$root.navigate({ ...TENANT_FORM, params: params })
    },
    toServicePage (params) {
      this.$root.navigate({ ...TENANT_SERVICE, params: params })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.updateIsEnabled-icon {
  transition: all .3s ease;
}
</style>
