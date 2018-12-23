var option = {
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		data: ['访问量', '注册量']
	},
	grid: {
		left: '2%',
		right: '3%',
		bottom: '2%',
		containLabel: true
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', ]
	},
	yAxis: {
		type: 'value'
	},
	series: [{
			name: '访问量',
			type: 'line',
			stack: '总量',
			symbolSize: 10,
			smooth: true,
			data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 290, 330]
		},
		{
			name: '注册量',
			type: 'line',
			stack: '总量',
			symbolSize: 10,
			smooth: true,
			data: [223, 182, 191, 234, 290, 330, 310, 101, 134, 90, 230, 210]
		}
	]
};

var staVue = new Vue({
	el: ".content",
	data: {
		pageSize:10,//每页条数
		totalPageSize:24,//总页数
		page:1,//当前页
	},
	mounted: function(){
		var tongjiChart = echarts.init(document.getElementById('tongjiChart'));
		tongjiChart.setOption(option);
	},
	methods: {
		nextPage(){
			if(this.page<this.totalPageSize){
				this.page++;
			}
		},
		prePage(){
			if(this.page>1){
				this.page--;
			}
		},
		nowPage(n){
			this.page = n
		}
	}
})