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
		typeName: "",
		detailData: null//编辑时的数据
	},
	mounted: function() {
		this.getClassData()
	},
	methods: {
		add() {
			this.typeName = "";
			this.detailData = null;
			this.showClass = true
		},
		edit(data) {
			if(!data){
				return;
			}
			var _this = this;
			_this.detailData = data;
			_this.typeName = _this.detailData.typeName;
			_this.showClass = true
		},
		deleteData(id) {
			var _this = this;
			layer.confirm('你确定要删除该分类？', {
				btn: ['确定'],
			}, function(index) {
				_this.$http.get(window.config.HTTPURL + "rest/babyClassroomType/deleteById?id=" + id).then(function(res) {
					if(res.data.code == "0000") {
						layer.msg("删除成功！")
						_this.getClassData()
					} else {
						layer.msg(res.data.msg)
					}
				}, function() {
					layer.msg("服务器错误！")
				})
			});
		},
		//查询分类列表
		getClassData() {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/babyClassroomType/selectByType").then(function(res) {
				if(res.data.code == "0000") {
					_this.dataList = res.data.data;
					layui.use(['form'], function() {
						form = layui.form
					})
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
					layer.msg("服务器错误！")
				})
		},
		saveClass(){
			var _this = this;
			var params = {
				id: _this.detailData==null?null:_this.detailData.id,
				typeName: _this.typeName||""
			}
			_this.$http.post(window.config.HTTPURL + "rest/babyClassroomType/saveAndUpdate",JSON.stringify(params)).then(function(res) {
				if(res.data.code == "0000") {
					layer.msg("保存成功！")
					setTimeout(function() {
						_this.getClassData()
						_this.showClass = false
					}, 1000)
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
					layer.msg("服务器错误！")
				})
		},
		closeClass(){
			this.showClass = false
		}
	}
})