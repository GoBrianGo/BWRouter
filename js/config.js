//router setting
(function(window, router, undefined) {
	router.route([{
		url: '/account-msg/:accountName',
		templateHtml: './template/account-msg.html'
	}, {
		url: '/personal-msg/:accountName',
		templateHtml: './template/personal-msg.html'
	}]); 
	router.defaultRoute({
		url: '/register',
		templateHtml: './template/register.html'
	}); 
	
})(window, SPARouter);

//judge devicepixelratio
(function(window, undefined) {
    var dpr =  Math.round(window.devicePixelRatio) || 1,
    docEl = document.documentElement;
  
    // 设置data-dpr属性，留作的css hack之用
    docEl.setAttribute('data-dpr', dpr);
})(window);

//global constant setting
(function(window, undefined) {
	var CONSTANT = {
		BASEPATH: 'http://172.16.1.168:3000/api/', //根路径
		TENANT_ID: 'atwork',//租户id
		AJAX_SUCCESS: 0, //请求成功状态码
		CAN_REGISTER: 23103, //可用的用户名状态码
		MSG_DURATION: 10, // 再次发送验证时间间隔
		PASSWORD_LENGTH: 6, //密码最少位数
		REGISTER_TITLE: '注册WorkPlus', //获取验证码页面title
		ACCOUNT_SETTING: '设置账号信息', //设置账号信息title
		PERSONAL_MSG_SETTING: '设置用户信息' //设置用户信息title
	};
	window.CONSTANT = CONSTANT;
})(window);