<template>
  <div class="app-container waybill-cont">
    <div class="queryForm">
      <el-form size="small" :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="">
          <el-input v-model="queryForm.orderNo" placeholder="订单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.wayBillNo" placeholder="运单号" :editable="false"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.expressType" clearable placeholder="快递类型">
            <el-option
              v-for="item in expressArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.wayBillStatus" placeholder="运单状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option
              v-for="item in wayBillStatus"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.goodsName" placeholder="物品名"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.operator" placeholder="处理人员"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.receiverMobile" placeholder="收件人手机号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="下单开始日期"
            end-placeholder="下单结束日期"
            v-model="queryForm.orderTimeRange"
            placeholder="下单时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="queryForm.processTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="处理开始日期"
            end-placeholder="处理结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.isException" placeholder="是否异常">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.processStatus" placeholder="处理状态">
            <el-option label="全部" value="-1"></el-option>
            <el-option label="未处理" value="未处理"></el-option>
            <el-option label="未处理|挂起" value="未处理|挂起"></el-option>
            <el-option label="已处理|未提交" value="已处理|未提交"></el-option>
            <el-option label="已处理|已提交" value="已处理|已提交"></el-option>
            <el-option label="待办理" value="待办理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="queryForm.deliveryMobile" placeholder="快递员手机号"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.agentId" clearable placeholder="代理商">
            <el-option
              v-for="item in dropAgents"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="queryHandle(1)">查询</el-button>
          <el-button
            v-if="roles.indexOf('SYS_ADMIN') > -1 || roles.indexOf('DELIVER') > -1"
            size="small"
            type="primary"
            @click="wayBillUploadHandle"
            >运单导入</el-button
          >
          <el-button
            v-if="roles.indexOf('SYS_ADMIN') > -1 || roles.indexOf('DELIVER') > -1"
            size="small"
            type="primary"
            @click="batchUpdateStatusHandle"
            >批量更新运单状态</el-button
          >
          <el-button
            v-if="roles.indexOf('SYS_ADMIN') > -1"
            size="small"
            type="primary"
            @click="wayBillExceptionUploadHandle"
            >异常单导入</el-button
          >
          <el-button
            v-if="roles.indexOf('SYS_ADMIN') > -1"
            size="small"
            type="primary"
            @click="auditExportHandle"
            >批量审核</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <div class="waybill-tables">
      <el-table
        :data="tableDataSearch"
        border
        size="mini"
        center
        style="width: 100%;font-size: 13px;"
        highlight-current-row
      >
        <el-table-column prop="wayBillNo" label="运单号" width="100" align="center">
        </el-table-column>
        <el-table-column
          prop="expressType"
          label="快递类型"
          align="center"
          :formatter="expressTypeFormatter"
        >
        </el-table-column>
        <el-table-column prop="hangReason" label="挂起原因" width="250" align="center">
          <template slot-scope="scope">
            <ol v-if="scope.row.hangReason">
              <li :key="item.index" v-for="item in scope.row.hangReason.split(',')">
                <span>{{ item }}</span>
              </li>
            </ol>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="物品名" width="120" align="center">
        </el-table-column>
        <el-table-column prop="receiver" label="收件人" align="center"> </el-table-column>
        <el-table-column prop="receiverMobile" label="收件人手机号" width="110" align="center">
          <template slot-scope="scope">
            <el-button @click="copy(scope.row.receiverMobile)" type="text" size="small">{{
              scope.row.receiverMobile
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" width="180" align="center">
        </el-table-column>
        <el-table-column prop="channel" label="渠道" align="center"> </el-table-column>
        <el-table-column prop="collectionFee" label="代收货款" align="center"> </el-table-column>
        <el-table-column prop="statusUpdateTime" label="状态更新时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="orderTime" width="90" label="下单时间" align="center">
        </el-table-column>
        <el-table-column prop="wayBillStatus" label="运单状态" align="center"> </el-table-column>
        <el-table-column prop="processStatus" label="处理状态" width="110" align="center">
        </el-table-column>
        <el-table-column prop="processTime" label="处理时间" width="90" align="center">
        </el-table-column>
        <el-table-column prop="changeWayBillNo" label="换单号" align="center"> </el-table-column>
        <el-table-column prop="isReject" label="是否拒收" align="center"> </el-table-column>
        <el-table-column prop="exceptionType" label="异常类型" align="center"> </el-table-column>
        <el-table-column prop="problemDesc" label="问题描述" width="120" align="center">
        </el-table-column>
        <el-table-column prop="operator" label="操作员" align="center"> </el-table-column>
        <el-table-column prop="option" width="70" fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="wayTrace(scope.row)" type="text" size="small">轨迹</el-button>
            <!-- <el-button
              v-if="
                !scope.row.operatorId &&
                  (scope.row.processStatus === '未处理' ||
                    scope.row.processStatus === '未处理|挂起')
              "
              @click="claimException(scope.row)"
              type="text"
              size="small"
              >办理</el-button
            > -->
          </template>
        </el-table-column>
        <div slot="empty" v-if="total <= 0">
          <p :style="{ marginTop: '23px' }">未查询到数据记录</p>
        </div>
      </el-table>
    </div>
    <div class="waybill-pages" v-if="total > 0">
      <Pagination
        :total="total"
        :perpages="perpageNumber"
        :currentPage="currentPage"
        @currentPage="getCurrentPage"
      ></Pagination>
    </div>

    <el-dialog
      @close="wayBillUploadClose"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="waybillUploadVisible"
    >
      <el-form>
        <el-form-item label="代理商：">
          <el-select v-model="waybillUploadForm.agentId" placeholder="">
            <el-option
              v-for="item in dropAgents"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递类型：">
          <el-select v-model="waybillUploadForm.expressType" placeholder="">
            <el-option
              v-for="item in expressArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
            <el-option label="韵达在线支付" value="31"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="wayBillUpload"
            :limit="1"
            :multiple="false"
            :action="this.baseURL + '/file/upload'"
            :on-success="waybillUploadSuccess"
          >
            <el-button size="small">上传运单</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="waybillUploadLoading"
            size="small"
            type="primary"
            @click="waybillUploadHandle"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      @close="batchUpdateStatusClose"
      size="small"
      title="更新运单状态"
      :close-on-click-modal="false"
      :visible.sync="batchUpdateStatusVisible"
    >
      <el-form>
        <el-form-item label="快递类型：">
          <el-select v-model="batchUpdateStatusForm.expressType" placeholder="">
            <el-option
              v-for="item in expressArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="batchUpdateStatus"
            :limit="1"
            :multiple="false"
            :action="this.baseURL + '/file/upload'"
            :on-success="batchUpdateStatusSuccess"
          >
            <el-button size="small">上传运单</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="batchUpdateStatusLoading"
            size="small"
            type="primary"
            @click="batchUpdateStatusCommit"
            >确认导入</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      @close="wayBillExceptionUploadClose"
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="waybillExceptionUploadVisible"
    >
      <el-form>
        <el-form-item label="代理商：">
          <el-select v-model="waybillExceptionUploadForm.agentId" placeholder="">
            <el-option
              v-for="item in dropAgents"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递类型：">
          <el-select v-model="waybillExceptionUploadForm.expressType" placeholder="">
            <el-option
              v-for="item in expressArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="wayBillExceptionUpload"
            :limit="1"
            :multiple="false"
            :action="this.baseURL + '/file/upload'"
            :on-success="waybillExceptionUploadSuccess"
          >
            <el-button size="small">上传异常运单</el-button>
          </el-upload>
          <el-form-item>
            <el-button
              :loading="waybillExceptionUploadLoading"
              size="small"
              type="primary"
              @click="waybillExceptionUploadHandle"
              >确认导入</el-button
            >
          </el-form-item>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="waybillAuditVisible"
    >
      <el-form label-width="80px">
        <el-form-item label="代理商：">
          <el-select v-model="auditAgentId" placeholder="">
            <el-option
              v-for="item in dropAgents"
              :key="item.agentId"
              :label="item.agentName"
              :value="item.agentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="waybillAuditHandle">确认导出</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="waybillHandleVisible"
    >
      <el-form :model="handleForm" label-width="160px">
        <el-form-item label="运单号">
          <el-input v-model="handleForm.wayBillNo" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="handleForm.auditStatus" placeholder="">
            <el-option label="再次投递" value="再次投递"></el-option>
            <el-option label="拒收退回" value="拒收退回"></el-option>
            <el-option label="报废处理" value="报废处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见">
          <el-select style="width: 100%;" v-model="handleForm.auditOpinion" placeholder="">
            <el-option label="请退回处理" value="请退回处理"></el-option>
            <el-option label="客户要签收，辛苦再配送" value="客户要签收，辛苦再配送"></el-option>
            <el-option
              label="已妥投，辛苦尽快更新运单状态"
              value="已妥投，辛苦尽快更新运单状态"
            ></el-option>
            <el-option
              label="代收金额已改成0，请妥投，千万别退回，谢谢大哥"
              value="代收金额已改成0，请妥投，千万别退回，谢谢大哥"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="意见备注">
          <el-input v-model="handleForm.auditOpinionOther" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="最后一次处理结果">
          <el-select v-model="handleForm.lastResult" placeholder="">
            <el-option label="拒收退回" value="拒收退回"></el-option>
            <el-option label="报废处理" value="报废处理"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户是否已签收">
          <el-switch v-model="handleForm.userSigned" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleExceptionCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title=""
      :close-on-click-modal="false"
      :visible.sync="waybillHangVisible"
    >
      <el-form :model="hangForm" label-width="160px">
        <el-form-item label="运单号">
          <el-input v-model="hangForm.wayBillNo" :disabled="true" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="挂起原因">
          <el-select style="width: 100%;" v-model="hangForm.hangReason" placeholder="">
            <el-option label="客户联系不上" value="客户联系不上"></el-option>
            <el-option label="客户要求自提" value="客户要求自提"></el-option>
            <el-option
              label="客户要求快递员再次配送，已经与快递沟通"
              value="客户要求快递员再次配送，已经与快递沟通"
            ></el-option>
            <el-option
              label="客户同意签收，快递联系不上"
              value="客户同意签收，快递联系不上"
            ></el-option>
            <el-option
              label="快递未配送，客户要求再次配送"
              value="快递未配送，客户要求再次配送"
            ></el-option>
            <el-option label="客户要求延期配送" value="客户要求延期配送"></el-option>
            <el-option label="其他原因" value="其他原因"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因备注">
          <el-input v-model="hangForm.hangReasonOther" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="改价金额">
          <el-input v-model="hangForm.hangReasonPrice" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用户签收意向">
          <el-select v-model="hangForm.intentionLevel" placeholder="">
            <el-option label="高" value="高"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="低" value="低"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="hangExceptionCommit">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      size="small"
      title="运单轨迹"
      :close-on-click-modal="false"
      :visible.sync="wayTraceVisible"
    >
      <div v-html="traceHtml"></div>
    </el-dialog>

    <el-dialog
      size="small"
      width="70%"
      title="异常运单办理"
      :close-on-click-modal="false"
      :visible.sync="wayClaimVisible"
      @close="queryHandle()"
    >
      <el-row :gutter="10">
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">运单号：</label>
            <div class="el-form-item__content">{{ claimForm.wayBillNo }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">物品名：</label>
            <div class="el-form-item__content">{{ claimForm.goodsName }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">代收货款：</label>
            <div class="el-form-item__content">{{ claimForm.collectionFee }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">收件人：</label>
            <div class="el-form-item__content">{{ claimForm.receiver }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">收件人手机号：</label>
            <div class="el-form-item__content">{{ claimForm.receiverMobile }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">渠道：</label>
            <div class="el-form-item__content">{{ claimForm.channel }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">下单时间：</label>
            <div class="el-form-item__content">{{ claimForm.orderTime }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">状态更新时间：</label>
            <div class="el-form-item__content">{{ claimForm.statusUpdateTime }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">运单状态：</label>
            <div class="el-form-item__content">{{ claimForm.wayBillStatus }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">处理状态：</label>
            <div class="el-form-item__content">{{ claimForm.processStatus }}</div>
          </div></el-col
        >
        <el-col :span="8"
          ><div>
            <label class="el-form-item__label">处理时间：</label>
            <div class="el-form-item__content">{{ claimForm.processTime }}</div>
          </div></el-col
        >
        <el-col :span="12"
          ><div>
            <label class="el-form-item__label">收件人地址：</label>
            <div class="el-form-item__content">{{ claimForm.receiverAddress }}</div>
          </div></el-col
        >
        <el-col :span="12"
          ><div>
            <label class="el-form-item__label">挂起原因：</label>
            <div v-if="claimForm.hangReason" class="el-form-item__content">
              <span :key="index" v-for="(item, index) in claimForm.hangReason.split(',')">
                {{ index + 1 + '. ' + item }}<br />
              </span>
            </div></div
        ></el-col>
      </el-row>
      <div style="margin-top: 10px; text-align: right;">
        <el-button size="small" type="warning" @click="wayTrace(claimForm)">轨迹</el-button>
        <el-button size="small" type="success" @click="handleException(claimForm)">处理</el-button>
        <el-button size="small" type="primary" @click="hangException(claimForm)">挂起</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination/index'
import {
  listPage,
  uploadWaybill,
  batchUpdateStatus,
  uploadWaybillException,
  handle,
  hang,
  trace,
  claim
} from '@/api/waybill.js'
import { listUserAgents } from '@/api/user.js'
import axios from 'axios'
import { expressArray } from '@/utils/const'

export default {
  name: 'Waybill',
  components: {
    Pagination
  },
  computed: {
    ...mapGetters(['roles'])
  },
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API,
      tableDataSearch: [],
      currentPage: 1,
      perpageNumber: 20,
      total: 0,
      queryForm: {
        orderTimeRange: [],
        processTimeRange: []
      },
      waybillUploadVisible: false,
      batchUpdateStatusVisible: false,
      waybillExceptionUploadVisible: false,
      waybillFileName: '',
      batchUpdateStatusFileName: '',
      waybillExceptionFileName: '',
      waybillHandleVisible: false,
      handleForm: {
        auditStatus: '再次投递',
        lastResult: '拒收退回',
        auditOpinion: '',
        auditOpinionOther: '',
        userSigned: false
      },
      waybillUploadLoading: false,
      batchUpdateStatusLoading: false,
      waybillExceptionUploadLoading: false,
      waybillHangVisible: false,
      hangForm: {
        hangReason: '',
        hangReasonOther: '',
        intentionLevel: '',
        hangReasonPrice: ''
      },
      wayTraceVisible: false,
      traceHtml: '',
      wayClaimVisible: false,
      claimForm: {},
      dropAgents: [],
      waybillUploadForm: {
        agentId: '',
        expressType: '1'
      },
      batchUpdateStatusForm: {
        expressType: '4'
      },
      waybillExceptionUploadForm: {
        agentId: '',
        expressType: '1'
      },
      waybillAuditVisible: false,
      auditAgentId: '',
      wayBillStatus: [
        '妥投',
        '拒收',
        '客户取消',
        '终止揽收',
        '订单入站',
        '配送员收货',
        '协商再投结果',
        '分拣中心发货',
        '分拣中心验货',
        '站点验货',
        '站点再投',
        '已取消',
        '再投后退回'
      ],
      expressArray: expressArray
    }
  },
  methods: {
    queryHandle(page) {
      if (page) {
        this.currentPage = page
      }
      this.getListByPage(this.perpageNumber, this.currentPage)
    },
    // 页码发生变化
    getCurrentPage(perPage, currPage) {
      this.currentPage = currPage
      this.perpageNumber = perPage
      this.getListByPage(perPage, currPage)
    },
    // 异步获取数据
    getListByPage(numPerPage, pageNum) {
      if (
        !this.queryForm.orderNo &&
        !this.queryForm.receiverMobile &&
        !this.queryForm.wayBillNo &&
        !this.queryForm.deliveryMobile
      ) {
        this.$message({
          message: '请增加查询条件',
          type: 'error',
          duration: 1000
        })
        return
      }
      let orderTimeStart = ''
      let orderTimeEnd = ''
      let processTimeStart = ''
      let processTimeEnd = ''
      if (this.queryForm.orderTimeRange) {
        orderTimeStart = this.queryForm.orderTimeRange[0]
        orderTimeEnd = this.queryForm.orderTimeRange[1]
      }
      if (this.queryForm.processTimeRange) {
        processTimeStart = this.queryForm.processTimeRange[0]
        processTimeEnd = this.queryForm.processTimeRange[1]
      }
      var param = {
        numPerPage: numPerPage,
        pageNum: pageNum,
        orderNo: this.queryForm.orderNo,
        wayBillNo: this.queryForm.wayBillNo,
        wayBillStatus: this.queryForm.wayBillStatus === '-1' ? '' : this.queryForm.wayBillStatus,
        goodsName: this.queryForm.goodsName,
        operator: this.queryForm.operator,
        orderTimeStart: orderTimeStart,
        orderTimeEnd: orderTimeEnd,
        processTimeStart: processTimeStart,
        processTimeEnd: processTimeEnd,
        receiverMobile: this.queryForm.receiverMobile,
        isException: this.queryForm.isException === '-1' ? '' : this.queryForm.isException,
        processStatus: this.queryForm.processStatus === '-1' ? '' : this.queryForm.processStatus,
        deliveryMobile: this.queryForm.deliveryMobile,
        agentId: this.queryForm.agentId,
        expressType: this.queryForm.expressType === '-1' ? '' : this.queryForm.expressType
      }
      listPage(param).then(res => {
        this.tableDataSearch = res.data.recordList
        this.total = res.data.totalCount
      })
    },
    copy(value) {
      this.$copyText(value).then(
        () => {
          this.$message({
            message: '复制成功',
            type: 'success',
            duration: 1000
          })
        },
        () => {
          this.$message({
            message: '复制失败，请手动复制',
            type: 'error',
            duration: 1000
          })
        }
      )
    },
    expressTypeFormatter(row) {
      const item = this.expressArray.find(item => item.value === row.expressType)
      return item ? item.label : row.expressType
    },
    wayBillUploadHandle() {
      this.waybillUploadVisible = true
    },
    wayBillUploadClose() {
      this.$refs['wayBillUpload'].clearFiles()
      this.waybillUploadForm.agentId = ''
      this.waybillUploadForm.expressType = '1'
    },
    batchUpdateStatusHandle() {
      this.batchUpdateStatusVisible = true
    },
    batchUpdateStatusClose() {
      this.$refs['batchUpdateStatus'].clearFiles()
      this.batchUpdateStatusForm.expressType = '4'
    },
    wayBillExceptionUploadClose() {
      this.$refs['wayBillExceptionUpload'].clearFiles()
      this.waybillExceptionUploadForm.agentId = ''
      this.waybillExceptionUploadForm.expressType = '1'
    },
    wayBillExceptionUploadHandle() {
      this.waybillExceptionUploadVisible = true
    },
    waybillUploadSuccess(res) {
      this.waybillFileName = res.data.fileName
    },
    batchUpdateStatusSuccess(res) {
      this.batchUpdateStatusFileName = res.data.fileName
    },
    waybillExceptionUploadSuccess(res) {
      this.waybillExceptionFileName = res.data.fileName
    },
    waybillUploadHandle() {
      if (!this.waybillFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        agentId: this.waybillUploadForm.agentId,
        expressType: this.waybillUploadForm.expressType,
        fileName: this.waybillFileName
      }
      this.waybillUploadLoading = true
      uploadWaybill(param)
        .then(res => {
          this.waybillUploadLoading = false
          this.waybillUploadVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.waybillUploadLoading = false
        })
    },
    batchUpdateStatusCommit() {
      if (!this.batchUpdateStatusFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }
      var param = {
        expressType: this.batchUpdateStatusForm.expressType,
        fileName: this.batchUpdateStatusFileName
      }
      this.batchUpdateStatusLoading = true
      batchUpdateStatus(param)
        .then(res => {
          this.batchUpdateStatusLoading = false
          this.batchUpdateStatusVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.batchUpdateStatusLoading = false
        })
    },
    waybillExceptionUploadHandle() {
      if (!this.waybillExceptionFileName) {
        this.$message({
          message: '请先上传数据文件',
          type: 'error'
        })
      }

      var param = {
        agentId: this.waybillExceptionUploadForm.agentId,
        expressType: this.waybillExceptionUploadForm.expressType,
        fileName: this.waybillExceptionFileName
      }
      this.waybillExceptionUploadLoading = true
      uploadWaybillException(param)
        .then(res => {
          this.waybillExceptionUploadLoading = false
          this.waybillExceptionUploadVisible = false
          this.$message({
            message: res.msg || '数据导入成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.waybillExceptionUploadLoading = false
        })
    },
    handleException(row) {
      this.waybillHandleVisible = true
      this.handleForm.wayBillNo = row.wayBillNo
      this.handleForm.auditStatus = '再次投递'
      this.handleForm.lastResult = '拒收退回'
      this.handleForm.auditOpinion = ''
      this.handleForm.auditOpinionOther = ''
      this.handleForm.opinionDisabled = true
      this.handleForm.userSigned = false
    },
    async handleExceptionCommit() {
      await claim({ wayBillNo: this.handleForm.wayBillNo })

      const auditOpinionOther = this.handleForm.auditOpinionOther
        ? '|' + this.handleForm.auditOpinionOther
        : ''
      const param = {
        wayBillNo: this.handleForm.wayBillNo,
        auditStatus: this.handleForm.auditStatus,
        auditOpinion: this.handleForm.auditOpinion + auditOpinionOther,
        lastResult: this.handleForm.lastResult,
        userSigned: this.handleForm.userSigned
      }
      handle(param).then(res => {
        this.waybillHandleVisible = false
        this.wayClaimVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryHandle()
      })
    },
    hangException(row) {
      this.waybillHangVisible = true
      this.hangForm.hangReason = ''
      this.hangForm.hangReasonOther = ''
      this.hangForm.hangReasonPrice = ''
      this.hangForm.wayBillNo = row.wayBillNo
      this.hangForm.intentionLevel = ''
    },
    async hangExceptionCommit() {
      await claim({ wayBillNo: this.hangForm.wayBillNo })

      let reason = this.hangForm.hangReason
      const reasonOther = this.hangForm.hangReasonOther ? '|' + this.hangForm.hangReasonOther : ''
      const reasonPrice = this.hangForm.hangReasonPrice
        ? '|改价' + this.hangForm.hangReasonPrice
        : ''
      reason = reason + reasonOther + reasonPrice
      const param = {
        wayBillNo: this.hangForm.wayBillNo,
        hangReason: reason,
        intentionLevel: this.hangForm.intentionLevel
      }
      hang(param).then(res => {
        this.waybillHangVisible = false
        this.wayClaimVisible = false
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.queryHandle()
      })
    },
    auditExportHandle() {
      this.waybillAuditVisible = true
    },
    waybillAuditHandle() {
      axios({
        method: 'post',
        url: this.baseURL + '/wayBillException/exportAudit?agentId=' + this.auditAgentId,
        responseType: 'blob'
      }).then(res => {
        this.waybillAuditVisible = false
        const fileName = '运单审核.xls'
        const blob = new Blob([res.data], { type: 'application/xls' })
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName
          link.click()
          window.URL.revokeObjectURL(link.href)
        }
      })
    },
    wayTrace(row) {
      this.traceHtml = '查询中...'
      this.wayTraceVisible = true

      const param = {
        wayBillNo: row.wayBillNo
      }
      trace(param).then(res => {
        this.traceHtml = res.data ? res.data : '未查询到运单轨迹'
      })
    },
    claimException(row) {
      this.wayClaimVisible = true
      this.claimForm.wayBillNo = row.wayBillNo
      this.claimForm.goodsName = row.goodsName
      this.claimForm.collectionFee = row.collectionFee
      this.claimForm.receiver = row.receiver
      this.claimForm.receiverMobile = row.receiverMobile
      this.claimForm.receiverAddress = row.receiverAddress
      this.claimForm.channel = row.channel
      this.claimForm.orderTime = row.orderTime
      this.claimForm.statusUpdateTime = row.statusUpdateTime
      this.claimForm.wayBillStatus = row.wayBillStatus
      this.claimForm.processStatus = row.processStatus
      this.claimForm.processTime = row.processTime
      this.claimForm.hangReason = row.hangReason
    },
    // listAgents() {
    //   listAgents().then(res => {
    //     this.dropAgents = res.data
    //   })
    // },
    listUserAgents() {
      listUserAgents().then(res => {
        this.dropAgents = res.data
      })
    }
    //   expressTypeChange(val) {
    //     const jdWayBillStatus = [
    //       '妥投',
    //       '拒收',
    //       '客户取消',
    //       '终止揽收',
    //       '订单入站',
    //       '配送员收货',
    //       '协商再投结果',
    //       '分拣中心发货',
    //       '分拣中心验货',
    //       '站点验货',
    //       '站点再投',
    //       '已取消',
    //       '再投后退回'
    //     ]
    //     const dbWayBillStatus = ['妥投', '已开单', '运输中', '派送中', '已滞留', '反签收', '已退回']
    //     if (val === '1') {
    //       this.wayBillStatus = jdWayBillStatus
    //     } else if (val === '2') {
    //       this.wayBillStatus = dbWayBillStatus
    //     }
    //   }
  },
  create() {},
  mounted() {
    // 挂载页面获取数据
    // this.getListByPage(this.perpageNumber, this.currentPage)
    this.listUserAgents()
  }
}
</script>

<style lang="scss" scoped>
.logWork-cont {
  .logWork-tables {
    margin-top: 20px;
  }
  .logWork-pages {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
