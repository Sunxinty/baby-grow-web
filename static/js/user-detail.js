var layer, $;
var userToken = window.localStorage.getItem("userToken") || "";
var userInfo = window.localStorage.getItem("userInfo") || null;
if(userInfo){
	userInfo = JSON.parse(userInfo)
	//console.log("登录用户",userInfo)
}
Vue.http.headers.common['token'] = userToken;

layui.use(['form','laydate'], function() {
		layer = layui.layer;
})

var userDetailVue = new Vue({
	el:".container",
	data: {
		
	},
	mounted: function(){
		
	},
	methods: {
		nextPage(){
			if(this.page<this.totalPageSize){
				this.page++;
				this.getData(this.page)
			}
		},
		prePage(){
			if(this.page>1){
				this.page--;
				this.getData(this.page)
			}
		},
		nowPage(n){
			this.page = n
			this.getData(this.page)
		},
		getData(page) {
			if(!page){
				page = 1
			}
			var _this = this;
		},
	}
})
