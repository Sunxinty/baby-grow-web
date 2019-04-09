var layer;
layui.use(['layer'], function() {
	layer = layui.layer;
	var indexVue = new Vue({
		el: "#content",
		data: {
			userInfo: null
		},
		mounted: function() {
			this.userInfo = window.localStorage.getItem("userInfo");
			if(this.userInfo == null || this.userInfo == "") {
				layer.msg("请登录！")
				setTimeout(function(){
					top.location.href = "view/login.html"
				},1000)
			} else {
				this.userInfo = JSON.parse(this.userInfo)
			}
		},
		methods: {},
	
	})
})