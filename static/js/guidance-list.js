var layer, $, laydate, form;
var userToken = window.localStorage.getItem("userToken") || "";
Vue.http.headers.common['token'] = userToken;

layui.use(['layer', 'laydate'], function() {
	layer = layui.layer,
		laydate = layui.laydate,
		$ = layui.jquery;

	laydate.render({
		elem: '#timeRange',
		range: true,
		format: "yyyy-MM-dd",
		done: function(value, date, endDate) {
			console.log(value);
		}
	});
})

var listVue = new Vue({
	el: ".container",
	data: {
		timeRange: yuerTools.getSelfDate(30) + " - " + yuerTools.getSelfDate(0),
		ageRange: 0,
		pageSize: 10, //每页条数
		totalPageSize: 1, //总页数
		page: 1, //当前页
		pageData: [], //当前页数据
		dataList: [], //列表数据
		totalNumber: 0, //总条数
		typeData: []
	},
	mounted: function() {
		this.getClassData()
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
		add() {
			window.localStorage.setItem("detailId", "")
			layer.open({
				type: 2,
				title: "添加文章",
				area: ['90%', '90%'],
				fixed: false,
				maxmin: true,
				content: '../view/guidance-edit.html'
			});
		},
		edit(id) {
			window.localStorage.setItem("detailId", id)
			layer.open({
				type: 2,
				title: "编辑文章",
				area: ['90%', '90%'],
				fixed: false,
				maxmin: true,
				content: '../view/guidance-edit.html'
			});
		},
		deleteData(id) {
			var _this = this;
			layer.confirm('你确定要删除该条文章？', {
				btn: ['确定'],
			}, function(index) {
				_this.$http.get(window.config.HTTPURL + "rest/encyclopeArticle/deleteById?id=" + id).then(function(res) {
					if(res.data.code == "0000") {
						layer.msg("删除成功！")
						_this.getData(_this.page)
					} else {
						layer.msg(res.data.msg)
					}
				}, function() {
					layer.msg("服务器错误！")
				})
			});
		},
		commentList(id) {
			window.localStorage.setItem("detailId", id)
			layer.open({
				type: 2,
				title: "评论列表",
				area: ['90%', '90%'],
				fixed: false,
				maxmin: true,
				content: '../view/guidance-comment.html'
			});
		},
		getData(page) {
			var _this = this;
			_this.ageRange = $("#ageRange").val() == null ? 0 : $("#ageRange").val();
			_this.timeRange = $("#timeRange").val();
			if(!page) {
				layer.msg("参数错误")
				return;
			} else if(_this.timeRange == "") {
				layer.msg("请选择时间")
				return;
			}
			var params = {
				page: page,
				size: 10,
				startTime: (_this.timeRange).substr(0, 10) + " 00:00:00",
				endTime: (_this.timeRange).substr(13) + " 23:59:59",
				monthTypeId: _this.ageRange
			}
			_this.$http.get(window.config.HTTPURL + "/rest/encyclopeArticle/selectByPage?page=" + params.page + "&size=" + params.size + "&startTime=" + params.startTime + "&endTime=" + params.endTime + "&monthTypeId=" + params.monthTypeId).then(function(res) {
				if(res.data.code == "0000") {
					_this.dataList = res.data.data.list;
					_this.totalNumber = res.data.data.total;
					_this.totalPageSize = res.data.data.pages == 0 ? 1 : res.data.data.pages;
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
				layer.msg("服务器错误！")
			})
		},
		//查询分类(此处只获取一级分类)
		getClassData() {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/encyclopeType/getTypeTree?type=MO").then(function(res) {
				if(res.data.code == "0000") {
					_this.typeData = res.data.data;
					_this.getData(_this.page)
				} else {
					layer.msg(res.data.msg)
				}
				layui.use(['form'], function() {
					form = layui.form
				})
			})
		}
	}
})