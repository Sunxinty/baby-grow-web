var layer, $, laydate, form;
var userInfo = window.localStorage.getItem("userInfo") || null;
if(userInfo) {
	userInfo = JSON.parse(userInfo)
	//console.log("登录用户",userInfo)
}

layui.use(['form'], function() {
	layer = layui.layer,
		form = layui.form;
})

var userListVue = new Vue({
	el: ".container",
	data: {
		dataList: [],
		orderDetail: null, //详情
	},
	mounted: function() {
		this.getData(this.sex)
	},
	methods: {
		getData() {
			var _this = this;
			var sex = $("#sex").val();
			_this.$http.get(window.config.HTTPURL + "rest/babyMonthSurvey/selectByList/"+sex).then(function(res) {
				if(res.data.code == "0000") {
					var dataList = res.data.data;
					_this.dataList = dataList;
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
				layer.msg("服务器错误！")
			})
		},
		//点击查看详情
		getBodyDetail(item) {
			var _this = this;
			_this.orderDetail = item;
			var detailHtml =
				`<div class="section detail-box">
						<p>性别：${_this.orderDetail.sex==1?"男":"女"}</p>
						<p>月龄：${_this.orderDetail.monthOld}个月</p>
						<p>创建时间：${_this.orderDetail.createTime}</p>
						<p>更新时间：${_this.orderDetail.updateTime}</p>
						<p style="width:100%">内容：${_this.orderDetail.content}</p>
					</div>`
			layer.open({
				type: 1,
				title: "本月概况详情",
				skin: 'layui-layer-rim', //加上边框
				area: ['720px', '400px'], //宽高
				content: detailHtml
			});
		}
	}
})