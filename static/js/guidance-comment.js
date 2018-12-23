var layer, form;

var detailId = window.localStorage.getItem("detailId") || "";
var userInfo = window.localStorage.getItem("userInfo") || null;
var userToken = window.localStorage.getItem("userToken") || "";

userInfo = JSON.parse(userInfo)

Vue.http.headers.common['token'] = userToken;

layui.use(['layer', 'laydate'], function() {
	var layer = layui.layer,
		laydate = layui.laydate,
		$ = layui.jquery;

	laydate.render({
		elem: '#timeRange',
		range: true,
		format: "yyyy/MM/dd"
	});
})

var commentVue = new Vue({
	el: ".container",
	data: {
		pageSize: 10, //每页条数
		totalPageSize: 24, //总页数
		page: 1, //当前页
	},
	mounted: function() {

	},
	methods: {
		nextPage() {
			if(this.page < this.totalPageSize) {
				this.page++;
			}
		},
		prePage() {
			if(this.page > 1) {
				this.page--;
			}
		},
		nowPage(n) {
			this.page = n
		}
	}
})