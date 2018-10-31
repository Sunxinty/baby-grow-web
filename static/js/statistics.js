var tongjiChart = echarts.init(document.getElementById('tongjiChart'));

var option = {
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		data: ['访问量', '注册量']
	},
	grid: {
		left: '2%',
		right: '6%',
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

tongjiChart.setOption(option);

layui.use(['table', 'laypage'], function() {
	var table = layui.table;
	var laypage = layui.laypage;
	table.render({
		elem: '#regitTable',
		//url: '../static/js/data.json',
		minWidth: 100,
		limit: 5,
		cols: [
			[{
				field: 'date',
				align: 'center',
				title: '日期',
				width: "222"
			}, {
				field: 'username',
				align: 'center',
				title: '用户名',
				width: "222"
			}, {
				field: 'acc',
				align: 'center',
				title: '账号',
				width: "222"
			}, {
				field: 'sex',
				align: 'center',
				title: '性别',
				width: "222"
			}, {
				field: 'children',
				align: 'center',
				title: '宝宝量',
				width: "222"
			}, {
				field: 'vip',
				align: 'center',
				title: 'VIP会员',
				width: "222"
			}, {
				field: 'oparate',
				align: 'center',
				title: '操作',
				width: "222",
				toolbar: '#barEdit',
			}]
		],
		data: [{
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "20007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "30007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "50007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "60007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}, {
			"date": "10007",
			"username": "user-7",
			"sex": "男",
			"children": "城市-7",
			"acc": "签名-7",
			"vip": "727"
		}],
		page: true,
//		done: function(res, curr, count) {
//			//如果是异步请求数据方式，res即为你接口返回的信息。
//			//如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
//			laypage.render({
//				elem: 'laypage',
//				count: 14,
//				limit: 5,
//				layout: ['prev', 'page', 'next', 'count'],
//			})
//		}
	});
});