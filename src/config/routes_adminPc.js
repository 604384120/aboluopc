module.exports = [
	/*
	 * 管理员端路由
	 * path: 路由浏览器地址
	 * name: 路由中文名
	 * icon: 路由图标，详情：https://ant.design/components/icon-cn/
	 * component: 根目录pages目录下路由文件地址
	 * sublist： 伪二级路由，对应为左侧主菜单的子菜单，注意：当没有子菜单时值必须为空数组
	 * type: 路由类型，暂时只支持设置index、404
	 */

	// {
	// 	name: "概览",
	// 	icon: "icon-gailan",
	// 	path: "/adminPc/overview",
  //   component: "/overview/index",
	// 	// type: "index",
	// 	sublist: []
	// },
	{
		name: "店铺管理",
		icon: "icon-dianpu",
		type: "index",
		path: "/adminPc/shops",
		component: "/shops/index",
		sublist: []
	},
	{
		name: "编辑商品模块",
		icon: "icon-car",
		hide: true,
		path: "/adminPc/CustomModuleAdd",
		component: "/shops/CustomModuleAdd",
		sublist: []
	},
	{
		name: "编辑轮播图组",
		icon: "icon-car",
		hide: true,
		path: "/adminPc/CustomModuleBanner",
		component: "/shops/CustomModuleBanner",
		sublist: []
	},
	{
		name: "编辑内容",
		icon: "icon-car",
		hide: true,
		path: "/adminPc/SystemAdd",
		component: "/shops/SystemAdd",
		sublist: []
	},
	{
		name: "编辑自定义页面",
		icon: "icon-car",
		hide: true,
		path: "/adminPc/CustomPageAdd",
		component: "/shops/CustomPageAdd",
		sublist: []
	},
	{
		name: "内容管理",
		icon: "icon-neirong",
		sublist: [
			//	课程
			{
				name: "课程列表",
				path: "/adminPc/class",
				component: "/class/index",
				sublist: []
			},
			{
				name: "课程详情",
				hide: true,
				path: "/adminPc/ClassInfo",
				component: "/class/ClassInfo",
				sublist: []
			},
			{
				name: "修改课程基本信息",
				hide: true,
				path: "/adminPc/ClassAdd",
				component: "/class/ClassAdd",
				sublist: []
			},
			//	课程 》课节
			{
				name: "课节详情",
				hide: true,
				path: "/adminPc/LessonsAdd",
				component: "/class/LessonsAdd",
				sublist: []
			},
			//	课程 》课节 》 练习、教材、合辑
			{
				name: "课节练习",
				hide: true,
				path: "/adminPc/Practice",
				component: "/class/Practice",
				sublist: []
			},
			{
				name: "课节教材",
				hide: true,
				path: "/adminPc/LessonTextbook",
				component: "/class/LessonTextbook",
				sublist: []
			},
			//	教材
			{
				name: "教材列表",
				path: "/adminPc/textbook",
				component: "/textbook/index",
				sublist: []
			},
			{
				name: "教材详情",
				path: "/adminPc/TextbookInfo",
				component: "/textbook/TextbookInfo",
				hide: true,
				sublist: []
			},
			{
				name: "编辑教材基本信息",
				path: "/adminPc/TextbookAdd",
				component: "/textbook/TextbookAdd",
				hide: true,
				sublist: []
			},
			{
				name: "编辑教材内容",
				path: "/adminPc/TextbookFileAdd",
				component: "/textbook/TextbookFileAdd",
				hide: true,
				sublist: []
			},
			{
				name: "题库列表",
				path: "/adminPc/topic",
				component: "/topic/index",
				sublist: []
			},
			{
				name: "合辑列表",
				path: "/adminPc/album",
				component: "/album/index",
				sublist: []
			},
			{
				name: "编辑合辑",
				path: "/adminPc/AlbumAdd",
				component: "/album/AlbumAdd",
				hide: true,
				sublist: []
			},
		]
	},
	{
		name: "用户管理",
		icon: "icon-renyuan",
		path: "/adminPc/user",
		component: "/user/index",
		sublist: []
	},
	{
		name: "用户详情",
		icon: "icon-car",
		hide: true,
		path: "/adminPc/UserInfo",
		component: "/user/UserInfo",
		sublist: []
	},
	//	用户下的课程详情
	{
		name: "课程详情",
		icon: "icon-car",
		hide: true,
		path: "/adminPc/UserLessonInfo",
		component: "/user/UserLessonInfo",
		sublist: []
	},
	{
		name: "交易管理",
		icon: "icon-shouyin",
		sublist: [
			{
				name: "用户订单",
				path: "/adminPc/order",
				component: "/order/index",
				sublist: []
      },
      {
        name: "订单详情",
        path: "/adminPc/details",
        component: "/order/details",
        hide: true,
        sublist: []
      },
			{
				name: "开通记录",
				path: "/adminPc/provisioning",
				component: "/provisioning/index",
				sublist: []
      },
      {
        name: "批量开通",
        path: "/adminPc/batchOpen",
        component: "/provisioning/BatchOpen",
        hide: true,
        sublist: []
      },
		]
	},
	{
		name: "互动管理",
		icon: "icon-jiaxiao",
		sublist: [
			{
				name: "笔记管理",
				path: "/adminPc/notebook",
				component: "/notebook/index",
				sublist: []
			},
			{
				name: "评论管理",
				path: "/adminPc/remark",
				component: "/remark/index",
				sublist: []
			},
		]
	},
	{
		name: "系统设置",
		icon: "icon-shezhi",
		sublist: [
			{
				name: "账号管理",
				path: "/adminPc/accounts",
				component: "/accounts/index",
				sublist: []
			},
			{
				name: "编辑账号",
				path: "/adminPc/accountInfo",
				component: "/accounts/Info",
				hide: true,
				sublist: []
			},
			{
				name: "角色设置",
				path: "/adminPc/roles",
				component: "/role/index",
				sublist: []
			},
			{
				name: "编辑角色",
				path: "/adminPc/roleInfo",
				component: "/role/Info",
				hide: true,
				sublist: []
			},
			{
				name: "标签设置",
				path: "/adminPc/tagLabel",
				component: "/tagLabel/index",
				sublist: []
			},
      {
				name: "渠道设置",
				path: "/adminPc/channelSet",
				component: "/channelSet/index",
				sublist: []
      },
      {
				name: "操作日志",
				path: "/adminPc/actionLog",
				component: "/actionLog/index",
				sublist: []
			},
		]
	},
	{
		path: "/adminPc/404",
		name: "页面不存在",
		type: "404",
		hide: true,
		component: "/other/404",
		sublist: []
	},
	{
		path: "/adminPc/test",
		name: "test",
		hide: true,
		component: "/other/test",
		sublist: []
	},
];
