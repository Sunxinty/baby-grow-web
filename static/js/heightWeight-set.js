var layer, $, form;

layui.use(['layer'], function() {
	layer = layui.layer,
		$ = layui.jquery;
})

var listVue = new Vue({
	el: ".container",
	data: {
		dataList: [], //列表数据
		showClass: false,
		heightMin: 0,
		weightMin: 0,
		headSizeMin: 0,
		heightMax: 0,
		weightMax: 0,
		headSizeMax: 0,
		month: 0,
		sex: 1,
		thisId: null
	},
	mounted: function() {
		var _this = this;
		_this.getData(1)
		layui.use(['form'], function() {
			form = layui.form;
			form.on('select(sexValue)', function(data) {
				_this.getData(data.value)
			});
		})
	},
	methods: {
		add() {
			this.showClass = true
		},
		edit(id) {
			if(!id) {
				return;
			}
			this.thisId = id;
			this.getDataById(id)
			this.showClass = true
		},
		//查询列表
		getData(type) {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/babyHealthySandar/selectByList?type="+type).then(function(res) {
				if(res.data.code == "0000") {
					_this.dataList = res.data.data;
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
				layer.msg("服务器错误！")
			})
		},
		getDataById(id) {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/babyHealthySandar/selectById?id=" + id).then(function(res) {
				if(res.data.code == "0000") {
					var data = res.data.data;
					layui.use(['form'], function() {
						form = layui.form;
					})
					$("input[name=sex][value=1]").attr("checked", data.sex == 1 ? true : false);
					$("input[name=sex][value=2]").attr("checked", data.sex == 2 ? true : false);
					_this.heightMin = data.heightMin / 10
					_this.weightMin = data.weightMin / 1000
					_this.headSizeMin = data.headSizeMin / 10
					_this.heightMax = data.heightMax / 10
					_this.weightMax = data.weightMax / 1000
					_this.headSizeMax = data.headSizeMax / 10
					_this.month = data.month
					form.render();
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
				layer.msg("服务器错误！")
			})
		},
		saveData() {
			var _this = this;
			var params = {
				"id": _this.thisId,
				"heightMin": _this.heightMin*10,
				"weightMin": _this.weightMin*1000,
				"headSizeMin": _this.headSizeMin*10,
				"heightMax": _this.heightMax*10,
				"weightMax": _this.weightMax*1000,
				"headSizeMax": _this.headSizeMax*10
			}
			_this.$http.post(window.config.HTTPURL + "rest/babyHealthySandar/updateById", JSON.stringify(params)).then(function(res) {
				if(res.data.code == "0000") {
					layer.msg("保存成功！")
					setTimeout(function() {
						_this.getData(1)
						_this.showClass = false
					}, 1000)
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
				layer.msg("服务器错误！")
			})
		},
		closeClass() {
			this.showClass = false
		}
	}
})