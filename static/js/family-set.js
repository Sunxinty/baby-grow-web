var layer, $, form;

layui.use(['layer'], function () {
	layer = layui.layer,
		$ = layui.jquery;
})

var listVue = new Vue({
	el: ".container",
	data: {
		dataList: [], //列表数据
		showClass: false,
		typeName: "",
		detailData: null //编辑时的数据
	},
	mounted: function () {
		this.getData()
	},
	methods: {
		add() {
			this.typeName = "";
			this.detailData = null;
			this.showClass = true
		},
		edit(data) {
			if (!data) {
				return;
			}
			var _this = this;
			_this.detailData = data;
			_this.typeName = _this.detailData.name;
			_this.showClass = true
		},
		deleteData(id) {
			var _this = this;
			layer.confirm('你确定要删除该分类？', {
				btn: ['确定'],
			}, function (index) {
				_this.$http.get(window.config.HTTPURL + "/rest/familyRelation/deleteById?id=" + id).then(function (res) {
					if (res.data.code == "0000") {
						layer.msg("删除成功！")
						_this.getData()
					} else {
						layer.msg(res.data.msg)
					}
				}, function () {
					layer.msg("服务器错误！")
				})
			});
		},
		//查询列表
		getData() {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "/rest/familyRelation/selectByList").then(function (res) {
				if (res.data.code == "0000") {
					_this.dataList = res.data.data;
					layui.use(['form'], function () {
						form = layui.form
					})
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		saveData() {
			var _this = this;
			if (_this.typeName == "") {
				layer.msg("请输入关系")
				return;
			}
			var params = {
				"id": _this.detailData == null ? null : _this.detailData.id,
				"name": _this.typeName,
				"relationType": "OTHER"
			}
			_this.$http.post(window.config.HTTPURL + "/rest/familyRelation/saveAndUpdate", JSON.stringify(params)).then(function (res) {
				if (res.data.code == "0000") {
					layer.msg("保存成功！")
					setTimeout(function () {
						_this.getData()
						_this.showClass = false
					}, 1000)
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		closeClass() {
			this.showClass = false
		}
	}
})