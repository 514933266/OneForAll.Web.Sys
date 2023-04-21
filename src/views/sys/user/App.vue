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
          <search-input enterable v-model="searchOption.key" @click="search" placeholder="输入用户名称或账号搜索" size="mini"></search-input>
        </span>
      </div>
    </el-card>
    <el-card shadow="never" class="table-card">
      <el-table border :data="list" v-loading="loading" size="mini" class="ofa-table">
        <el-table-column width="50">
          <template slot-scope="scope">{{ scope.$index + 1 + (pageIndex - 1) * pageSize }}</template>
        </el-table-column>
        <el-table-column prop="Name" label="名称">
          <template slot-scope="scope">
            <div class="user-icon">
              <el-avatar :src="(domain + scope.row.IconUrl)"></el-avatar>
              <label>{{scope.row.Name}}</label>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="UserName" label="账号"></el-table-column>
        <el-table-column prop="TenantName" label="所属企业"></el-table-column>
        <el-table-column label="最后登录时间">
          <template slot-scope="scope">{{scope.row.LastLoginTime ? scope.row.LastLoginTime : '未登录' }}</template>
        </el-table-column>
        <el-table-column label="最后登录Ip">
          <template slot-scope="scope">{{scope.row.LastLoginIp ? scope.row.LastLoginIp : '未登录' }}</template>
        </el-table-column>
        <el-table-column label="管理员账号">
          <template slot-scope="scope">
            <el-tag :type="scope.row.IsDefault === true ? 'danger' : 'info'" size="mini">
              {{scope.row.IsDefault ? '管理员' : '普通账号'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Status === status[0].value ? 'danger' : 'success'" effect="dark" size="mini">
              {{status.find(w => w.value == scope.row.Status).label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" header-align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="update(scope.row)">修改</el-button>
            <el-button type="text" class="ofa-text-danger" size="mini" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" @size-change="pageSizeChange"
        @current-change="pageIndexChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import API from '../../../apis/sys-api'
import BASE_API from '../../../apis/base-api'
import { USER, USER_FORM } from '../../../router/sys-router'
import { NOT_ALLOWED, SUCCESS } from '../../../untils/error'

export default {
  name: USER.name,
  data () {
    return {
      loading: false, // 加载中
      serverUrl: API.BASE_SERVICE_DOMAIN,
      searchOption: {
        key: '' // 搜索条件（关键字）
      },
      total: 1, // 总数据量
      pageIndex: 1, // 页码
      pageSize: 10, // 页数
      list: [], // 用户列表
      status: [{ value: NOT_ALLOWED, label: '封禁' }, { value: SUCCESS, label: '正常' }] // 状态
    }
  },
  computed: {
    permissions () {
      return this.$root.getPermissions(USER.name)
    },
    domain () {
      return this.$root.getApiDomain(BASE_API.KEY)
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
      const url = this.$root.getApi(API.KEY, API.USER.URL)
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
      this.$confirm('确认要删除选中用户？删除后不可恢复，请谨慎操作！', '温馨提示', {
        type: 'warning',
        cancelButtonText: '放弃操作'
      }).then(() => {
        const url = this.$root.getApi(API.KEY, API.USER.BATCH_DELETE)
        this.axios.patch(url, [entity.Id]).then(response => {
          if (response.Status) this.get()
        })
      })
    },
    toFormPage (params) {
      this.$root.navigate({ ...USER_FORM, params: params })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.user-icon {
  display: flex;
  align-items: center;

  label {
    margin-left: 10px;
  }
}
</style>