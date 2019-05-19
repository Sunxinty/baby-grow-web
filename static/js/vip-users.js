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
		detailData: null, //编辑时的数据
		vipType: 1, //vip时间状态1-天，2-月，5-终身
		vipNumber: 0, //期限时间
		vipState: 3, //vip状态3-禁用，4-启用
		vipCash: 0, //费用
		vipDescribe: "", //描述
	},
	mounted: function () {
		this.getData()
	},
	methods: {
		add() {
			var _this = this;
			this.detailData = null;
			this.vipType = 1;
			this.vipNumber = 0;
			this.vipCash = 0;
			this.vipDescribe = "";
			this.showClass = true;
			setTimeout(function () {
				_this.initForm()
			}, 100)
		},
		edit(id) {
			if (!id) {
				return;
			}
			var _this = this;
			_this.showClass = true;
			_this.getDataById(id);
		},
		deleteData(id) {
			var _this = this;
			layer.confirm('你确定要删除该分类？', {
				btn: ['确定'],
			}, function (index) {
				_this.$http.get(window.config.HTTPURL + "/rest/vipType/deleteById?id=" + id).then(function (res) {
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
			_this.$http.get(window.config.HTTPURL + "/rest/vipType/selectByList").then(function (res) {
				if (res.data.code == "0000") {
					_this.dataList = res.data.data;
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		//按ID查询vip配置
		getDataById(id) {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "/rest/vipType/selectById?id=" + id).then(function (res) {
				if (res.data.code == "0000") {
					_this.detailData = res.data.data;
					_this.vipType = _this.detailData.vipType;
					_this.vipDescribe = _this.detailData.vipDescribe;
					_this.vipState = _this.detailData.vipState;
					_this.vipCash = _this.detailData.vipCash / 100;
					_this.vipNumber = _this.detailData.number;
					setTimeout(function () {
						_this.initForm()
					}, 0)
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		//更改vip禁用状态
		changeStuatus(id) {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "/rest/vipType/updateState?id=" + id).then(function (res) {
				if (res.data.code == "0000") {
					$(".switch-btn[name='" + id + "']").toggleClass("active")
					layer.msg("修改状态成功！")
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		saveData() {
			var _this = this;
			if (_this.vipType != 5) {
				if (_this.vipNumber == "" || _this.vipNumber == 0) {
					layer.msg("请输入正确的vip期限")
					return;
				}
			} else if (_this.vipCash == "") {
				layer.msg("请输入费用")
				return;
			} else if (_this.vipDescribe == "") {
				layer.msg("请输入名称")
				return;
			}
			var params = {
				"id": _this.detailData == null ? null : _this.detailData.id,
				"vipDescribe": _this.vipDescribe,
				"vipType": Number(_this.vipType),
				"number": Number(_this.vipNumber),
				"vipState": Number(_this.vipState),
				"vipCash": _this.vipCash * 100
			}
			_this.$http.post(window.config.HTTPURL + "/rest/vipType/saveAndUpdate", JSON.stringify(params)).then(function (res) {
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
		},
		initForm() {
			var _this = this;
			layui.use(['form'], function () {
				form = layui.form;
				form.on('radio(viptype)', function (data) {
					_this.vipType = data.value;
				});
				form.render();
			})
		}
	}
})