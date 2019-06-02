var layer, $, laydate, form;
var userInfo = window.localStorage.getItem("userInfo") || null;
if(userInfo) {
	userInfo = JSON.parse(userInfo)
	//console.log("登录用户",userInfo)
}

layui.use(['laydate', 'form'], function() {
	layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate;

	laydate.render({
		elem: '#timeRange',
		range: true,
		format: "yyyy-MM-dd"
	});
})

var userListVue = new Vue({
	el: ".container",
	data: {
		pageSize: 10, //每页条数
		totalPageSize: 0, //总页数
		page: 1, //当前页
		dataList: [],
		total: 0,
		orderNumber: "",
		phone: "",
		timeRange: yuerTools.getSelfDate(356) + " - " + yuerTools.getSelfDate(0),
		orderDetail: null, //订单详情
	},
	mounted: function() {
		this.getData(this.page)
	},
	methods: {
		nextPage() {
			if(this.page < this.totalPageSize) {
				this.page++;
				this.getData(this.page)
			}
		},
		prePage() {
			if(this.page > 1) {
				this.page--;
				this.getData(this.page)
			}
		},
		nowPage(n) {
			this.page = n
			this.getData(this.page)
		},
		getData(page) {
			if(!page) {
				page = 1
			}
			var _this = this;
			_this.timeRange = $("#timeRange").val();

			var params = {
				"page": page,
				"size": 10,
				"fields": {
					"id": _this.orderNumber,
					"phone": _this.phone,
					"orderState": "",
				},
				"timeRanges": {
					"startTime": _this.timeRange == "" ? null : (_this.timeRange).substr(0, 10) + " 00:00:00",
					"endTime": _this.timeRange == "" ? null : (_this.timeRange).substr(13) + " 23:59:59",
				}
			}

			_this.$http.post(window.config.HTTPURL + "rest/vipOrder/selectByWebPage", JSON.stringify(params)).then(function(res) {
				if(res.data.code == "0000") {
					var dataList = res.data.data.list;
					_this.totalPageSize = res.data.data.pages;
					_this.total = res.data.data.total;
					for(let i = 0; i < dataList.length; i++) {
						let orderState = dataList[i].orderState; //订单状态
						let payType = dataList[i].payType; //支付方式
						switch(orderState) {
							case 1:
								orderState = "待支付";
								dataList[i].payTime = "—";
								break;
							case 2:
								orderState = "支付成功";
								break;
							case 3:
								orderState = "支付失败";
								break;
						}
						switch(payType) {
							case "WX_PAY":
								payType = "微信";
								break;
							case "ALI_PAY":
								payType = "支付宝";
								break;
						}
						dataList[i].orderState = orderState;
						dataList[i].payType = payType
					}
					setTimeout(function() {
						_this.dataList = dataList;
					}, 0)
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
				layer.msg("服务器错误！")
			})
		},
		//点击查看订单详情
		getBodyDetail(item) {
			var _this = this;
			_this.orderDetail = item;
			var detailHtml =
				`<div class="section detail-box">
						<p>用户昵称：${_this.orderDetail.userName||""}</p>
						<p>用户电话：${_this.orderDetail.phone}</p>
						<p>下单时间：${_this.orderDetail.createTime}</p>
						<p>订单金额(元)：${_this.orderDetail.payCash/100}</p>
						<p>支付时间：${_this.orderDetail.payTime}</p>
						<p>支付方式：${_this.orderDetail.payType}</p>
						<p>订单状态：${_this.orderDetail.orderState}</p>
						<p>vip类型：${_this.orderDetail.orderInfo}</p>
						<p>订单号：${_this.orderDetail.id}</p>
					</div>`
			layer.open({
				type: 1,
				title: "订单详情",
				skin: 'layui-layer-rim', //加上边框
				area: ['720px', '400px'], //宽高
				content: detailHtml
			});
		}
	}
})