var layer, upload, form, addEdit;
var detailId = window.localStorage.getItem("detailId") || null;
var userInfo = window.localStorage.getItem("userInfo") || null;

userInfo = JSON.parse(userInfo)


var editVue = new Vue({
	el: ".container",
	data: {
		id: "",
		title: "",
		content: "",
		introducer: "",
		coverImg: "",
		imgMsg:"",
		period:"",
	},
	mounted: function () {
		var _this = this;

		layui.use(['layer', 'upload'], function () {
			layer = layui.layer,
				upload = layui.upload;
			_this.getData()
			var uploadImg = upload.render({
				elem: '#uploadImg',
				url: '',
				auto: false,
				accept: 'imsges',
				acceptMime: 'imsge/*',
				choose: function (obj) {
					console.log(obj)
					obj.preview(function (index, file, result) {
						$('#previewImg').show().attr('src', result);
						_this.imgMsg = "准备上传..."
						setTimeout(function() {
							qiniuUpload(_this, file, "img", function(name, fileUrl) {
								_this.coverImg = window.config.uploadUrl+fileUrl
							})
						},500)
					})
				},
				bindAction: '',
				done: function (res) {
					console.log(res)
				}
			});
		})
	},
	methods: {
		saveData() {
			var _this = this;
			if (_this.title == "") {
				layer.msg("标题不能为空")
				return;
			}
			else if(_this.content == "") {
				layer.msg("内容不能为空")
				return;
			} 
			else if (_this.introducer == "") {
				layer.msg("摘要不能为空")
				return;
			}
			else if (_this.period == "") {
				layer.msg("期数不能为空")
				return;
			}
			
			var params = {
				title: _this.title,
				content: _this.content,
				introducer: _this.introducer,
				coverImg: _this.coverImg,
				period: Math.floor(_this.period)
			}
			var httpurl = "rest/dailyLesson/save"
			//修改
			if(detailId&&detailId!=''){
				params.id = detailId;
				httpurl = "rest/dailyLesson/update"
			}
			
			//console.log(params)
			_this.$http.post(window.config.HTTPURL + httpurl, JSON.stringify(params))
				.then(function (res) {
						if (res.data.code == "0000") {
							layer.msg("保存成功！")
							setTimeout(function () {
								var frameIndex = parent.layer.getFrameIndex(window.name)
								parent.layer.close(frameIndex);
								window.parent.location.reload();
							}, 500)
						} else {
							layer.msg(res.data.msg)
						}
					},
					function (err) {
						layer.msg("服务器错误！")
					}
				)

		},
		//根据id获取数据
		getData() {
			if (!detailId || detailId == "") {
				return;
			}
			var _this = this;
			var loadIndex = layer.load(1, {
				shade: [0.1, "#000"]
			})
			_this.$http.get(window.config.HTTPURL + "rest/dailyLesson/selectById/" + detailId).then(function (res) {
				layer.close(loadIndex);
				if (res.data.code == "0000") {
					_this.showTable(res.data.data)
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器出错！")
			})
		},
		//编辑时渲染表单
		showTable(data) {
			var _this = this;
			this.title = data.title;
			this.introducer = data.introducer;
			this.coverImg = data.coverImg;
			this.content = data.content;
			this.period = data.period;
			$('#previewImg').show().attr('src', this.coverImg);
		}
	}
})