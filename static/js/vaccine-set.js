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
		sendlingsName: "",
		detailData: null, //编辑时的数据
		unit: "", //时间类型
		rangeTime: 0, //时间长度
		summary: "", //说明
		thisId: null
	},
	mounted: function() {
		this.getDataList()
	},
	methods: {
		add() {
			var _this = this;
			this.sendlingsName = "";
			this.detailData = null;
			this.unit = "DAY";
			this.rangeTime = 0;
			this.summary = "";
			this.thisId = null;
			this.showClass = true
			setTimeout(function(){
				_this.initForm()
			},0)
		},
		edit(id) {
			if(!id) {
				return;
			}
			this.thisId = id;
			this.getDataById(this.thisId)
		},
		deleteData(id) {
			var _this = this;
			layer.confirm('你确定要删除该疫苗？', {
				btn: ['确定'],
			}, function(index) {
				_this.$http.get(window.config.HTTPURL + "rest/defaultSeedlings/deleteById?id=" + id).then(function(res) {
					if(res.data.code == "0000") {
						layer.msg("删除成功！")
						_this.getDataList()
					} else {
						layer.msg(res.data.msg)
					}
				}, function() {
					layer.msg("服务器错误！")
				})
			});
		},
		//查询分类列表
		getDataList(name) {
			var _this = this;
			if(!name) {
				name = ""
			}
			_this.$http.get(window.config.HTTPURL + "rest/defaultSeedlings/selectByList?name=" + name).then(function(res) {
				if(res.data.code == "0000") {
					_this.dataList = res.data.data;
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
				layer.msg("服务器错误！")
			})
		},
		//按ID查询
		getDataById(id) {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/defaultSeedlings/selectById?id=" + id).then(function(res) {
				if(res.data.code == "0000") {
					this.showClass = true;
					var data = res.data.data;
					_this.sendlingsName = data.sendlingsName;
					_this.rangeTime = data.rangeTime;
					_this.summary = data.summary;
					_this.unit = data.unit;
					setTimeout(function(){
						_this.initForm()
					},0)
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
			    "sendlingsName": _this.sendlingsName,
			    "rangeTime": _this.rangeTime,
			    "unit": _this.unit,
			    "summary": _this.summary
			}
			_this.$http.post(window.config.HTTPURL + "rest/defaultSeedlings/insertAndUpdate", JSON.stringify(params)).then(function(res) {
				if(res.data.code == "0000") {
					layer.msg("保存成功！")
					setTimeout(function() {
						_this.getDataList()
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
		},
		initForm() {
			var _this = this;
			layui.use(['form'], function() {
				form = layui.form;
				form.on('radio(unit)', function(data) {
					_this.unit = data.value;
				});
				form.render();
			})
		}
	}
})