var layer,laydate,form;
layui.use(['layer', 'laydate','form'], function() {
		laydate = layui.laydate,
		layer = layui.layer,
		form = layui.form;

	laydate.render({
		elem: '#timeRange',
		range: true,
		format: "yyyy/MM/dd"
	});
})

var careRemindVue = new Vue({
	el: ".container",
	data: {
		pageSize: 10, //每页条数
		totalPageSize: 24, //总页数
		page: 1, //当前页
		pageData: [], //当前页数据
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
		},
		add() {
			layer.open({
				type: 2,
				title: "添加文章",
				area: ['90%', '90%'],
				fixed: false,
				maxmin: true,
				content: '../view/care-remind-edit.html'
			});
		},
		edit(data) {
			layer.open({
				type: 2,
				title: "编辑文章",
				area: ['90%', '90%'],
				fixed: false,
				maxmin: true,
				content: '../view/care-remind-edit.html'
			});
		},
		deleteData(data) {

		},
		commentList(data) {
			layer.open({
				type: 2,
				title: "评论列表",
				area: ['90%', '90%'],
				fixed: false,
				maxmin: true,
				content: '../view/guidance-comment.html'
			});
		}
	}
})