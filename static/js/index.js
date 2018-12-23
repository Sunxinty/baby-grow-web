
var indexVue = new Vue({
	el:"#content",
	data:{
		userInfo:null
	},
	mounted:function(){
		this.userInfo = window.localStorage.getItem("userInfo");
		if(this.userInfo==null||this.userInfo==""){
			layer.msg("请登录！")
		}
		else{
			this.userInfo = JSON.parse(this.userInfo)
		}
	},
	methods:{},
	
})
