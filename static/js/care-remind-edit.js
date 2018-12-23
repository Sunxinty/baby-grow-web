var layer, upload;
var E = window.wangEditor;
var detailId = window.localStorage.getItem("detailId")||2;

layui.use(['layer', 'upload'], function() {
		layer = layui.layer,
		upload = layui.upload;

	var uploadImg = upload.render({
		elem: '#uploadImg',
		url: '',
		auto: false,
		//headers: {token: ''},
		accept:'images',
		acceptMime: 'image/*',
		choose: function(obj){
			console.log(obj)
			obj.preview(function(index, file, result){
				$('#previewImg').show().attr('src', result);
			})
		},
		bindAction: '',
		done: function(res) {
			console.log(res)
		}
	});
	var uploadAudio = upload.render({
		elem: '#uploadAudio',
		url: '',
		auto: false,
		//headers: {token: ''},
		accept:'audio',
		choose: function(obj){
			console.log(obj)
			obj.preview(function(index, file, result){
				var audioEle = document.getElementById("previewAudio");
    			audioEle.src = result;
				audioEle.load();
			})
			
		},
		bindAction: '',
		done: function(res) {
			console.log(res)
		}
	});
})

var commentVue = new Vue({
	el: ".container",
	data: {
		dataObj:{
			title:"",
			audio:"",
			img:"",
			content:"",
			age:0
		},
		editor:null,
	},
	mounted: function() {
		this.editor = new E('#addEdit')
		this.editor.create()
		this.getDetail(detailId)
	},
	methods: {
		saveData() {
			console.log(this.editor.txt.html())
		},
		getDetail(id){
			var _this = this;
			if(id==null||id==undefined||id==""){
				return;
			}
			else{
				$(".layui-upload-img").show()
//				_this.$http.get().then(function(res){
//					
//				})
			}
		}
	}
})