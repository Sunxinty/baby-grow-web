var layer, $, laydate, form;
var userInfo = window.localStorage.getItem("userInfo") || null;
if (userInfo) {
	userInfo = JSON.parse(userInfo)
	//console.log("登录用户",userInfo)
}

layui.use(['laydate', 'form'], function () {
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
		userName: "",
		phone: "",
		regType: "",
		timeRange: yuerTools.getSelfDate(356) + " - " + yuerTools.getSelfDate(0),
	},
	mounted: function () {
		this.getData(this.page)
	},
	methods: {
		nextPage() {
			if (this.page < this.totalPageSize) {
				this.page++;
				this.getData(this.page)
			}
		},
		prePage() {
			if (this.page > 1) {
				this.page--;
				this.getData(this.page)
			}
		},
		nowPage(n) {
			this.page = n
			this.getData(this.page)
		},
		getData(page) {
			if (!page) {
				page = 1
			}
			var _this = this;
			_this.timeRange = $("#timeRange").val();

			var params = {
				"page": page,
				"size": 10,
				"fields": {
					"userName": _this.userName,
					"phone": _this.phone,
					"sex": $("#sex").val() == "" ? null : $("#sex").val(),
					"vip": $("#vip").val() == "" ? null : $("#vip").val()
				},
				"timeRanges": {
					"startTime": _this.timeRange == "" ? null : (_this.timeRange).substr(0, 10) + " 00:00:00",
					"endTime": _this.timeRange == "" ? null : (_this.timeRange).substr(13) + " 23:59:59",
				}
			}

			_this.$http.post(window.config.HTTPURL + "/rest/appUser/selectByWebPage", JSON.stringify(params)).then(function (res) {
				if (res.data.code == "0000") {
					_this.dataList = res.data.data.list;
					_this.totalPageSize = res.data.data.pages;
					_this.total = res.data.data.total;
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		//编辑用户
		editData(id) {
			if (!id) {
				layer.msg("参数错误！")
				return;
			}
			window.localStorage.setItem("userId", id)
			layer.open({
				type: 2,
				title: "用户详情",
				area: ['100%', '100%'],
				fixed: false,
				maxmin: true,
				content: '../view/user-detail.html'
			});
		},
	}
})