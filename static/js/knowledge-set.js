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
		secondClass: [], //列表的二级分类
		thirdClass: [], //列表的三级分类
		editFirstClass: [], //编辑的一级分类
		editSecondClass: [], //编辑的二级分类
		editThirdClass: [], //编辑的三级分类
		firstClassName: "",
		secondClassName: "",
		thirdClassName: "",
		editFirstObj: null,
		editSecondObj: null,
		addThirdObj: {
			id: null,
			typeName: "add"
		},
		isEdit: false,
		chioceClass: 0
	},
	mounted: function () {
		this.getClassData(this.chioceClass)
		this.getFirstClass()
	},
	methods: {
		add() {
			this.firstClassName = "";
			this.secondClassName = "";
			this.thirdClassName = "";
			this.editFirstClass = [];
			this.editSecondClass = [];
			this.editThirdClass = [];
			this.editFirstObj = null;
			this.editSecondObj = null;
			this.showClass = true;
			this.isEdit = false;
			this.getFirstClass()
		},
		edit(dataF, dataS) {
			var _this = this;
			console.log(dataF, dataS)
			if (!dataS.typeName || dataS.typeName == "") {
				layer.alert("请先添加二级分类！")
				return;
			}
			_this.editFirstObj = dataF;
			_this.editSecondObj = dataS;
			this.getThirdClass(dataS.id);
			_this.showClass = true
			_this.isEdit = true;
		},
		deleteData(id, type) {
			var _this = this;
			if (!id) {
				return;
			}
			layer.confirm('你确定要删除该分类？', {
				btn: ['确定'],
			}, function (index) {
				_this.$http.get(window.config.HTTPURL + "rest/babyLoreType/deleteById?id=" + id + "&type=" + type).then(function (res) {
					if (res.data.code == "0000") {
						layer.msg("删除成功！")
						if (type == "CD") {
							_this.getThirdClass(_this.editSecondObj.id);
						} else {
							_this.getClassData(_this.chioceClass)
						}
					} else {
						layer.msg(res.data.msg)
					}
				}, function () {
					layer.msg("服务器错误！")
				})
			});
		},
		//编辑分类
		editInput(data, e) {
			var _this = this;
			if (data.typeName == "") {
				return;
			}
			var e = e || event;
			e = e.target;
			$(e).removeAttr("disabled").css("background", "#fff")
		},
		//查询分类列表
		getClassData(monthId) {
			var _this = this;
			if (!monthId) {
				monthId = 0;
			}
			_this.$http.get(window.config.HTTPURL + "rest/babyLoreType/selectByTypeTree").then(function (res) {
				_this.dataList = [];
				_this.secondClass = [];
				_this.thirdClass = [];
				if (res.data.code == "0000") {
					var dataList = res.data.data;
					var encyclopeTypes = [];
					var encyclopeChilds = [];
					if (dataList.length > 0) {
						for (var i = 0; i < dataList.length; i++) {
							var one = dataList[i].childs;
							if (one == null || one.length == 0) {
								one = [{
									typeName: ""
								}]
								_this.dataList.push(dataList[i])
								encyclopeTypes = encyclopeTypes.concat(one)
							} else {
								for (var j = 0; j < one.length; j++) {
									var two = one[j].childs;
									one[j].thirdStr = "";
									//one[j].inputStatus = true;
									if (two == null || two.length == 0) {
										two = [{
											typeName: ""
										}]
										encyclopeChilds = encyclopeChilds.concat(two)
									} else {
										for (var k = 0; k < two.length; k++) {
											one[j].thirdStr += two[k].typeName + "，"
										}
										encyclopeChilds = encyclopeChilds.concat(two)
									}
									_this.dataList.push(dataList[i])
								}
								encyclopeTypes = encyclopeTypes.concat(one)
							}
						}
					}
					_this.secondClass = encyclopeTypes;
					_this.thirdClass = encyclopeChilds;
					//console.log(_this.dataList,_this.secondClass,_this.thirdClass)
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		//查询一级分类
		getFirstClass(data) {
			var _this = this;
			_this.$http.get(window.config.HTTPURL + "rest/babyLoreType/selectByTypeList?pId=0").then(function (res) {
				if (res.data.code == "0000") {
					_this.editFirstClass = res.data.data;
					if (_this.editFirstClass.length == 0) {
						setTimeout(function () {
							_this.initForm()
						}, 0)
						return;
					}
					_this.getSecondClass(_this.editFirstClass[0].id)
				} else {
					layer.msg(res.data.msg)
				}

			})
		},
		//查询二级分类
		getSecondClass(id) {
			var _this = this;
			if (id == null || id == undefined) {
				return;
			}
			_this.$http.get(window.config.HTTPURL + "rest/babyLoreType/selectByTypeList?pId=" + id).then(function (res) {
				if (res.data.code == "0000") {
					_this.editSecondClass = res.data.data;
					if (_this.editSecondClass.length == 0) {
						setTimeout(function () {
							_this.initForm()
						}, 0)
						return;
					}
					setTimeout(function () {
						_this.initForm()
					}, 100)
				} else {
					layer.msg(res.data.msg)
				}
			})
		},
		//查询子分类
		getThirdClass(id) {
			var _this = this;
			if (id == null || id == undefined) {
				return;
			}
			_this.$http.get(window.config.HTTPURL + "rest/babyLoreType/selectByTypeList?pId=" + id).then(function (res) {
				if (res.data.code == "0000") {
					_this.editThirdClass = res.data.data;
					if (_this.editThirdClass.length == 0) {
						setTimeout(function () {
							_this.initForm()
						}, 0)
						return;
					}
					setTimeout(function () {
						_this.initForm()
					}, 100)
				} else {
					layer.msg(res.data.msg)
				}
			})
		},
		//保存一级分类
		saveFirstClass(id, e) {
			var _this = this;
			var e = e || event;
			e = e.target;
			if (!id) {
				var params = {
					"id": null,
					"typeName": _this.firstClassName,
					"parentId": 0
				}
			} else {
				var params = {
					"id": id,
					"typeName": $(e).val(),
					"parentId": 0
				}
				$(e).attr("disabled", "disabled").css("background", "none")
			}

			_this.$http.post(window.config.HTTPURL + "rest/babyLoreType/saveAndUpdate", JSON.stringify(params)).then(function (res) {
				if (res.data.code == "0000") {
					layer.msg("保存成功！")
					setTimeout(function () {
						_this.firstClassName = "";
						_this.getFirstClass()
					}, 500)
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		//保存二级分类
		saveSecondClass(id, monthId, e) {
			var _this = this;
			var e = e || event;
			e = e.target;
			if (!id) {
				var params = {
					"id": null,
					"typeName": _this.secondClassName,
					"parentId": $("#firstClass").val()
				}
			} else {
				var params = {
					"id": id,
					"typeName": $(e).val(),
					"parentId": monthId
				}
				$(e).attr("disabled", "disabled").css("background", "none")
			}

			_this.$http.post(window.config.HTTPURL + "rest/babyLoreType/saveAndUpdate", JSON.stringify(params)).then(function (res) {
				if (res.data.code == "0000") {
					layer.msg("保存成功！")
					setTimeout(function () {
						_this.secondClassName = "";
						_this.showClass = false;
						_this.getClassData(_this.chioceClass)
					}, 500)
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		//保存子分类
		saveThirdClass(obj) {
			var _this = this;
			if ($("input[name='tobj0']").val() == "") {
				layer.alert("请输入分类名称！")
				return;
			}
			var params = {
				"id": obj.id,
				"typeName": $("input[name='tobj0']").val(),
				"parentId": Math.floor($("input[name='editSecond']").attr("data-id"))
			}

			_this.$http.post(window.config.HTTPURL + "rest/babyLoreType/saveAndUpdate", JSON.stringify(params)).then(function (res) {
				if (res.data.code == "0000") {
					layer.msg("保存成功！")
					$("input[name='tobj0']").val("")
					_this.getThirdClass(_this.editSecondObj.id);
				} else {
					layer.msg(res.data.msg)
				}
			}, function () {
				layer.msg("服务器错误！")
			})
		},
		initForm() {
			var _this = this;
			layui.use(['form'], function () {
				form = layui.form;
				form.on('select(firstClass)', function (data) {});
				form.on('select(firstClass2)', function (data) {
					_this.getSecondClass(data.value)
				});
				form.on('select(monthValue)', function (data) {
					_this.chioceClass = data.value
					_this.getClassData(_this.chioceClass)
				});
				form.on('select(secondClass)', function (data) {});
				form.render("select");
			})
		},
		closeClass() {
			this.showClass = false
			this.getClassData(this.chioceClass)
		}
	}
})