var layer, upload;
var detailId = window.localStorage.getItem("cearId") || null;

var commentVue = new Vue({
	el: ".container",
	data: {
		dataObj: null,
		title: "",
		sources: "",
		period: null,
		firstImg: "",
		editor: null,
		imgMsg: "",
		audioMsg: ""
	},
	mounted: function () {
		var _this = this;
		//加载layui
		layui.use(['layer', 'upload'], function () {
			layer = layui.layer;
			upload = layui.upload;
			_this.getDetail(detailId)

			var uploadImg = upload.render({
				elem: '#uploadImg',
				url: '',
				auto: false,
				accept: 'images',
				acceptMime: 'image/*',
				choose: function (obj) {
					obj.preview(function (index, file, result) {
						$('#previewImg').show().attr('src', result);
						_this.imgMsg = "准备上传..."
						setTimeout(function () {
							qiniuUpload(_this, file, "img", function (name, fileUrl) {
								_this.firstImg = fileUrl
							})
						}, 100)
					})
				},
				bindAction: '',
				done: function (res) {
					console.log(res)
				}
			});
			var uploadAudio = upload.render({
				elem: '#uploadAudio',
				url: '',
				auto: false,
				accept: 'audio',
				choose: function (obj) {
					obj.preview(function (index, file, result) {
						var audioEle = document.getElementById("previewAudio");
						audioEle.src = result;
						audioEle.load();
						_this.audioMsg = "准备上传..."
						setTimeout(function () {
							qiniuUpload(_this, file, "audio", function (name, fileUrl) {
								_this.sources = fileUrl
							})
						}, 100)
					})
				},
				bindAction: '',
				done: function (res) {
					console.log(res)
				}
			});
		})

		//加载富文本编辑器
		_this.editor = $('#addEdit').summernote({
			height: 300,
			tabsize: 2,
			lang: 'zh-CN',
			toolbar: [
				['font', ['bold', 'underline', 'clear']],
				['fontsize', ['fontsize']],
				['fontname', ['fontname']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['table', ['table']],
				['insert', ['link', 'picture', 'video']],
				['view', ['fullscreen', 'codeview', 'help']]
			],
			callbacks: {
				onImageUpload: function (files) {
					//console.log(files);
					qiniuUpload(null, files[0], "image", function (name, url) {
						$('#addEdit').summernote('insertImage', url, 'img');
					})
				}
			}
		});
		//this.getDetail(detailId)
	},
	methods: {
		saveData() {
			var _this = this;
			var params = {
				"id": detailId,
				"title": _this.title,
				"sources": _this.sources,
				"content": $("#addEdit").summernote("code"),
				"firstImg": _this.firstImg
			}
			//console.log(params)
			_this.$http.post(window.config.HTTPURL + "/rest/careRemind/updateById", JSON.stringify(params))
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
		getDetail(id) {
			var _this = this;
			if (id == null || id == undefined || id == "") {
				return;
			} else {
				var loadIndex = layer.load(1, {
					shade: [0.1, "#000"]
				})
				$(".layui-upload-img").show()
				_this.$http.get(window.config.HTTPURL + "/rest/careRemind/selectById?id=" + id).then(function (res) {
					layer.close(loadIndex);
					if (res.data.code == "0000") {
						_this.dataObj = res.data.data;
						_this.title = _this.dataObj.title || "";
						_this.sources = _this.dataObj.sources || "";
						$("#addEdit").summernote("code", _this.dataObj.content)
						_this.period = _this.dataObj.period || "";
						_this.firstImg = _this.dataObj.firstImg || "";
					} else {
						layer.msg(res.data.msg)
					}
				}, function () {
					layer.msg("服务器出错！")
				})
			}
		}
	}
})