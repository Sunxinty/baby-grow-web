window.yuerTools = {
	// 获取n天前日期
	getSelfDate:function(n, str){
		//n：表示获取n天前的时间
		if(n==undefined){
			return "";
		}
		var now = new Date;
		var t = now.getTime();
		var m = t - n * 24 * 3600 * 1000;
		var s = new Date(m);
		var year = s.getFullYear();
		var month = s.getMonth() + 1
		var date = s.getDate()
		if(month < 10) {
			month = "0" + month
		}
		if(date < 10) {
			date = "0" + date
		}
		if(str) {
			return year + "-" + month + "-" + date + " " + str
		} else {
			return year + "-" + month + "-" + date
		}
	}
}

//在所有的请求前加token
window.userToken = window.localStorage.getItem("userToken") || "";
Vue.http.headers.common['token'] = window.userToken;

if(hookAjax){
	hookAjax({
		//拦截回调
		onreadystatechange: function(xhr) {},
		onload: function(res) {
			//console.log(res.xhr.response)
			var response = JSON.parse(res.xhr.response)
			if(response.code=="0005"){
				layer.msg(response.msg)
				setTimeout(function(){
					top.location.href = "../view/login.html"
				},1000)
			}
			else if(response.code=="0007"){
				layer.msg(response.msg)
				setTimeout(function(){
					top.location.href = "../view/login.html"
				},1000)
			}
			else if(window.userToken==""||window.userToken == null){
				setTimeout(function(){
					top.location.href = "../view/login.html"
				},1000)
			}
		},
		//拦截函数
		open: function(arg) {}
	})
}
