var layer, form, $;
layui.use(['form'], function () {
	layer = layui.layer,
		form = layui.form,
		$ = layui.jquery;

	var loginVue = new Vue({
		el: ".layui-form",
		data: {
			username: "",
			password: "",
			code: "",
			imgUrl: ""
		},
		mounted: function () {
			window.localStorage.setItem("userInfo", null)
			window.localStorage.setItem("userToken", null)
		},
		methods: {
			login() {
				var _this = this;
				if (_this.username == "") {
					layer.msg("用户名不能为空!")
					return;
				} else if (_this.password == "") {
					layer.msg("请输入密码！")
					return;
				} else if (_this.code == "") {
					layer.msg("请输入验证码！")
					return;
				} else if (_this.code.length != 4) {
					layer.msg("验证码数位不正确！")
					return;
				} else {
					var params = {
						"account": _this.username,
						"password": (md5(_this.password)).toUpperCase(),
						"code": _this.code
					}
					_this.$http.post(window.config.HTTPURL + "rest/user/login", JSON.stringify(params)).then(function (res) {
						if (res.data.code == "0000") {
							layer.msg("登录成功！")
							var userInfo = JSON.stringify(res.data.data);
							var userToken = res.data.data.token;
							window.localStorage.setItem("userInfo", userInfo);
							window.localStorage.setItem("userToken", userToken);
							setTimeout(function () {
								window.location.href = "../index.html"
							}, 1000)
						} else {
							layer.msg(res.data.msg)
						}
					})
				}
			},
			getCode() {
				var _this = this;
				if (_this.username == "") {
					layer.msg("请先输入用户名")
					return;
				} else {
					_this.$http.get(window.config.HTTPURL + "rest/user/getCodeImage?account=" + _this.username).then(function (res) {
						if (res.data.code == "0000") {
							_this.imgUrl = res.data.data
						} else {
							layer.msg(res.data.msg)
						}
					})
				}

			}
		},
	})
});