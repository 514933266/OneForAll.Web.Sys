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
          <base-area-cascader v-model="searchOption.parentId" ref="areaCascader" size="mini" placeholder="请选择上级地区">
          </base-area-cascader>
          <el-input v-model="searchOption.key" size="mini" placeholder="请输入要查询的关键字"></el-input>
          <el-button type="primary" class="search-btn" size="mini" @click="search">
            <font-awesome-icon fas icon="search"></font-awesome-icon>&nbsp;查询
          </el-button>
        </span>
      </div>
    </el-card>
    <el-card shadow="never" class="table-card">
      <el-table border :data="list" v-loading="loading" row-key="Id" size="mini" class="ofa-table">
        <el-table-column width="50">
          <template slot-scope="scope">{{ scope.$index + 1 + (pageIndex - 1) * pageSize }}</template>
        </el-table-column>
        <el-table-column prop="Name" label="名称"></el-table-column>
        <el-table-column prop="ShortName" label="简称">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ShortName" size="mini">{{scope.row.ShortName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="Code" label="代码"></el-table-column>
        <el-table-column label="等级">
          <template slot-scope="scope">{{ types[scope.row.Level] }}</template>
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
import { AREA, AREA_FORM } from '../../../router/sys-router'
import BaseAreaCascader from '../_components/AreaCascader'

// 系统地区管理
export default {
  name: AREA.name,
  data () {
    return {
      loading: false,
      searchOption: {
        key: '', // 关键字
        parentId: 0 // 所属上级
      },
      total: 1,
      pageIndex: 1,
      pageSize: 10,
      list: [],
      types: ['异常', '省', '市', '县区', '镇街']
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
      if (this.loading) return
      this.get()
    },
    get () {
      this.loading = true
      const url = this.$root.getApi(API.KEY, API.AREA.URL)
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
    selectionChange (rows) {
      this.selectionList = rows
    },
    add () {
      this.toFormPage({ isAdd: true })
    },
    update (entity) {
      this.toFormPage(entity)
    },
    del (entity) {
      this.$confirm('确认要删除该地区？删除后不可恢复，请谨慎操作！', '温馨提示', {
        type: 'warning',
        cancelButtonText: '放弃操作'
      }).then(() => {
        const url = this.$root.getApi(API.KEY, API.AREA.BATCH_DELETE)
        this.axios.patch(url, [entity.Id]).then(response => {
          if (response.Status) this.get()
        })
      })
    },
    toFormPage (params) {
      this.$root.navigate({ ...AREA_FORM, params: params })
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.$refs.areaCascader.init()
  },
  components: { BaseAreaCascader }
}
</script>

<style lang="scss" scoped>
/deep/ .ofa-work-box {

  input {
    width: 200px;
    margin-left: 10px;
  }

  .search-btn {
    margin-left: 10px;
  }
}
</style>
