var layer, $;
var userInfo = window.localStorage.getItem("userInfo") || null;
if(userInfo){
	userInfo = JSON.parse(userInfo)
	//console.log("登录用户",userInfo)
}

layui.use(['form','laydate'], function() {
		layer = layui.layer;
})

var userDetailVue = new Vue({
	el:".container",
	data: {
		userMsg:null,
		bodyMsg: [
	        {
	            "id": 1,
	            "createTime": "2018-10-06 09:49:09",
	            "updateTime": "2019-01-02 20:16:05",
	            "babyName": "谭泽宇",
	            "birthday": "2018-12-08",
	            "birthtime": "23:02",
	            "zodiac": "狗",
	            "constellation": "射手座",
	            "headurl": "http://file.nmmpa.cn/afa73516-812f-46ec-bb3c-1ba7568c68cb.jpg",
	            "sex": 1,
	            "lunarCalendar": "一月初六",
	            "appUserId": 1,
	            "birthHeight": 557,
	            "birthWeight": 2350,
	            "birthStatus": 1,
	            "bloodType": "其他",
	            "nickName": "堂堂",
	            "familyRelation": "妈妈",
	            "carer": "唐露",
	            "isDefault": "DEFAULY_NO",
	            "age": "1个月11天"
	        },
	        {
	            "id": 17,
	            "createTime": "2019-01-07 19:15:51",
	            "updateTime": "2019-01-08 08:05:42",
	            "babyName": "测试宝宝",
	            "birthday": "2018-02-07",
	            "birthtime": "19:14",
	            "zodiac": "狗",
	            "constellation": "水瓶座",
	            "headurl": "http://file.nmmpa.cn/8b156524-c891-4d16-b5f0-b7672542a395.png",
	            "sex": 1,
	            "lunarCalendar": null,
	            "appUserId": 1,
	            "birthHeight": 56,
	            "birthWeight": 3,
	            "birthStatus": null,
	            "bloodType": "A型",
	            "nickName": "小宝",
	            "familyRelation": null,
	            "carer": "谭帅",
	            "isDefault": "DEFAULT_YES",
	            "age": "11个月12天"
	        }
	    ],
	    isBody: true
	},
	mounted: function(){
		this.getUserData()
		this.getBodyData()
	},
	methods: {
		//会员详情
		getUserData(){
			var _this = this;
			var id = window.localStorage.getItem("userId");
			if(!id||id==null){
				layer.msg("参数错误！")
				return;
			}
			_this.$http.get(window.config.HTTPURL + "rest/appUser/selectById?id="+id).then(function(res) {
				if(res.data.code == "0000") {
					console.log(res.data.data)
					_this.userMsg = res.data.data;
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
					layer.msg("服务器错误！")
				})
		},
		//宝宝详情
		getBodyData(){
			var _this = this;
			var id = window.localStorage.getItem("userId");
			if(!id||id==null){
				layer.msg("参数错误！")
				return;
			}
			_this.$http.get(window.config.HTTPURL + "rest/appUser/selectByBabyList?id="+id).then(function(res) {
				if(res.data.code == "0000") {
					console.log(res.data.data)
					_this.bodyMsg = res.data.data;
				} else {
					layer.msg(res.data.msg)
				}
			}, function() {
					layer.msg("服务器错误！")
				})
		},
		changeIcon(type){
			this.isBody = type;
		}
	}
})
