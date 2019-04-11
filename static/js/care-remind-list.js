var layer, laydate, form;

layui.use(['layer', 'laydate', 'form'], function () {
	laydate = layui.laydate,
		layer = layui.layer,
		form = layui.form;

	laydate.render({
		elem: '#timeRange',
		range: true,
		format: "yyyy/MM/dd"
	});
})

var careRemindVue = new Vue({
	el: ".container",
	data: {
		pageSize: 10, //每页条数
		totalPageSize: 1, //总页数
		totalNumber: 0,
		page: 1, //当前页
		dataList: [],
	},
	mounted: function () {
		this.getDataList()
	},
	methods: {
		nextPage() {
			if (this.page < this.totalPageSize) {
				this.page++;
				this.getDataList(this.page)
			}
		},
		prePage() {
			if (this.page > 1) {
				this.page--;
				this.getDataList(this.page)
			}
		},
		nowPage(n) {
			this.page = n
			this.getDataList(this.page)
		},
		edit(id) {
			if (!id) {
				return;
			}
			window.localStorage.setItem("cearId", id)
			layer.open({
				type: 2,
				title: "编辑文章",
				area: ['90%', '90%'],
				fixed: false,
				maxmin: true,
				content: '../view/care-remind-edit.html'
			});
		},
		deleteData(id) {

		},
		//获取数据列表
		getDataList() {
			var _this = this;
			var params = {
				page: _this.page,
				size: _this.pageSize
			}
			_this.$http.post(window.config.HTTPURL + "rest/careRemind/selectByWebPage", JSON.stringify(params)).then(function (res) {
				if (res.data.code == "0000") {
					_this.dataList = res.data.data.list;
					_this.totalPageSize = res.data.data.pages;
					_this.totalNumber = res.data.data.total;
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		}
	}
})