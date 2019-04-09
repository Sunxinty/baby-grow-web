var uptoken_url = window.config.HTTPURL + "rest/qn/getToken";
var bucket = window.localStorage.getItem("bucket") || "";

if(!bucket || bucket == "") {
	Vue.http.get(window.config.HTTPURL + "/rest/qn/getBucket").then(function(res) {
		window.localStorage.setItem("bucket", res.data.data)
		bucket = res.data.data;
		console.log("bucket:", bucket)
	}, function() {
		console.error("获取bucket出错：服务器错误！")
	})
}

function qiniuUpload(vueObj, file, type) {
	Vue.http.get(uptoken_url).then(function(res) {
		uptoken = res.data.data;
		var fileUrl = bucket + "_" + type + (new Date()).getTime(); //自定义上传后文件名称
		var fileName = (file.name).substr(0, 20); //截取原文件名的20个字符串展示
		//设置上传过程的监听函数
		var observer = {
			//上传中(result参数带有total字段的 object，包含loaded、total、percent三个属性)
			next(result) {
				//查看进度[loaded:已上传大小(字节);total:本次上传总大小;percent:当前上传进度(0-100)]
				if(type && type == "img") {
					vueObj.imgMsg = "正在上传 " + (result.total.percent).toFixed(2) + "%"
				} else if(type && type == "audio") {
					vueObj.audioMsg = "正在上传 " + (result.total.percent).toFixed(2) + "%"
				}
			},
			error(err) { //失败后
				console.error("上传失败" + err.message)
				layer.msg("上传失败！")
				if(type && type == "img") {
					vueObj.imgMsg = fileName + " 上传失败" + err.message
				} else if(type && type == "audio") {
					vueObj.audioMsg = fileName + " 上传失败" + err.message
				}
			},
			complete(res) { //成功后
				layer.msg("上传成功！")
				console.log(res)
				if(type && type == "img") {
					vueObj.imgMsg = fileName + " 上传成功!"
				} else if(type && type == "audio") {
					vueObj.audioMsg = fileName + " 上传成功!"
				}
			}
		};
		var putExtra = {
			fname: file.name, //原文件名
			params: {}, //用来放置自定义变量
			mimeType: null //限制上传文件类型
		};
		var config = {
			region: null, //存储区域(z0:代表华东;z2:代表华南,不写默认自动识别)
			concurrentRequestLimit: 2 //分片上传的并发请求量
		};

		var observable = qiniu.upload(file, fileUrl, uptoken, putExtra, config);
		var subscription = observable.subscribe(observer); // 上传开始
	}, function() {
		console.error("获取uptoken出错：服务器错误！")
	})
}