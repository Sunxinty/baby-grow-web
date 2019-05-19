var layer, upload, form;
var detailId = window.localStorage.getItem("detailId") || "";
var userInfo = window.localStorage.getItem("userInfo") || null;

userInfo = JSON.parse(userInfo)

var editVue = new Vue({
	el: ".container",
	data: {
		id: "",
		title: "",
		keyWord: "",
		summary: "",
		firstImg: "",
		typeIds: null,
		articleType: null,
		editor: null,
		firstClass: [], //一级分类数组
		secondClass: [], //二级分类数组
		thirdClass: [], //三级分类数组
		showClass: false,
		thirdType: [], //三级type值
		saveClassData: null,
		imgMsg: "",
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
								_this.firstImg = window.config.uploadUrl+fileUrl
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
					layer.msg("正在上传...")
					qiniuUpload(null, files[0], "image", function (name, url) {
						$('#addEdit').summernote('insertImage', window.config.uploadUrl + url, 'img');
					})
				}
			}
		});
		//_this.getData();
		$("#classTable").on("click", "li p .deleteClass", function (e) {
			_this.deleteData(e)
		})
	},
	methods: {
		saveData() {
			var _this = this;
			if(_this.title == "") {
				layer.msg("标题不能为空")
				return;
			} else if (_this.keyWord == "") {
				layer.msg("关键字不能为空")
				return;
			}
			//else if(_this.editor.txt.html() == "") {
			//	layer.msg("内容不能为空")
			//	return;
			//} 
			else if (_this.summary == "") {
				layer.msg("摘要不能为空")
				return;
			}
			//console.log(_this.typeIds)
			var params = {
				id: detailId,
				title: _this.title,
				createUserId: userInfo.id,
				keyWord: _this.keyWord,
				content: $("#addEdit").summernote("code"),
				summary: _this.summary,
				firstImg: _this.firstImg,
				loreTypeId: _this.typeIds,
			}
			//console.log(params)
			_this.$http.post(window.config.HTTPURL + "/rest/babyLore/saveAndUpdate", JSON.stringify(params))
				.then(function(res) {
						if(res.data.code == "0000") {
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
			var loadIndex = layer.load(1,{shade: [0.1,"#000"]})
			_this.$http.get(window.config.HTTPURL + "/rest/babyLore/selectById?id=" + detailId).then(function(res) {
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
			this.summary = data.summary;
			this.firstImg = data.firstImg;
			this.keyWord = data.keyWord;
			$('#previewImg').show().attr('src', data.firstImg);
			//_this.editor.txt.html(data.content);
			$("#addEdit").summernote("code", data.content);
			this.typeIds = data.loreType[0].childs[0].childs[0].id;
			this.articleType = data.loreType[0];
		},
		//删除分类
		deleteData(e) {
			var p = e.target;
			layer.confirm('你确定要删除该分类？', {
				btn: ['确定'],
			}, function (index) {
				$(p).parents("li").remove()
				layer.closeAll();
			})
		},
		//显示分类选择
		showClassFn() {
			this.getFirstClass()
			this.showClass = true;
		},
		//关闭分类选择
		closeClass() {
			this.showClass = false;
		},
		//查询一级分类
		getFirstClass() {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/babyLoreType/selectByTypeList?pId=0").then(function(res) {
				if(res.data.code == "0000") {
					_this.firstClass = res.data.data;
					if (_this.firstClass.length == 0) {
						setTimeout(function () {
							_this.initForm()
						}, 0)
						return;
					}
					_this.getSecondClass(_this.firstClass[0].id)
				} else {
					layer.msg(res.data.msg)
				}
				setTimeout(function () {
					_this.initForm()
				}, 0)
			})
		},
		//查询二级分类
		getSecondClass(id) {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/babyLoreType/selectByTypeList?pId=" + id).then(function(res) {
				if(res.data.code == "0000") {
					_this.secondClass = res.data.data;
					$("#secondClass").html("");
					if (_this.secondClass.length == 0) {
						setTimeout(function () {
							_this.initForm()
						}, 0)
						return;
					}
					for (var i = 0; i < _this.secondClass.length; i++) {
						$("#secondClass").append("<option value='" + _this.secondClass[i].id + "'>" + _this.secondClass[i].typeName + "</option>")
					}
					_this.getThirdClass(_this.secondClass[0].id)
				} else {
					layer.msg(res.data.msg)
				}
				setTimeout(function () {
					_this.initForm()
				}, 0)
			})
		},
		//查询三级分类
		getThirdClass(id) {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/babyLoreType/selectByTypeList?pId=" + id).then(function(res) {
				if(res.data.code == "0000") {
					_this.thirdClass = res.data.data;
					$("#thirdClass").html("");
					if (_this.thirdClass.length == 0) {
						setTimeout(function () {
							_this.initForm()
						}, 0)
						return;
					}
					for(var i = 0; i < _this.thirdClass.length; i++) {
						if(_this.thirdClass[i].id==_this.typeIds){
							var radioItem = '<input type="radio" checked value="' + _this.thirdClass[i].id + '" lay-skin="primary" title="' + _this.thirdClass[i].typeName + '" name="thirdClass">'
						}
						else{
							var radioItem = '<input type="radio" value="' + _this.thirdClass[i].id + '" lay-skin="primary" title="' + _this.thirdClass[i].typeName + '" name="thirdClass">'
						}
						$("#thirdClass").append(radioItem)
					}
				} else {
					layer.msg(res.data.msg)
				}
				setTimeout(function () {
					_this.initForm()
				}, 0)
			})
		},
		//保存分类
		saveClass() {
			var _this = this;
			
			_this.saveClassData = {
				thirdName: "",
				firstID: null,
				firstName: "",
				secondName: ""
			};
			_this.saveClassData.firstID = $("#firstClass").val()
			_this.saveClassData.firstName = $("#firstClass option:checked").text()
			_this.saveClassData.secondName = $("#secondClass option:checked").text()
			_this.saveClassData.thirdName = $("#thirdClass input[type='radio']:checked").attr("title")
			_this.typeIds = $("#thirdClass input[type='radio']:checked").val()
			
			$("#classTable").html('<li><p class="width-10">' + _this.saveClassData.firstName + '</p><p class="width-20">' + _this.saveClassData.secondName + '</p><p class="width-50">' + _this.saveClassData.thirdName + '</p><p class="width-20"><a href="##" class="layui-btn layui-btn-danger deleteClass">删除</a></p></li>')

			layer.msg("保存分类成功！")
			setTimeout(function () {
				_this.showClass = false;
			}, 500)
		},
		initForm() {
			var _this = this;
			layui.use(['form'], function () {
				form = layui.form
				form.on('select(firstClass)', function (data) {
					_this.getSecondClass(data.value);
				});
				form.on('select(secondClass)', function (data) {
					_this.getThirdClass(data.value);
				});
				form.render();
			})
		}
	}
})