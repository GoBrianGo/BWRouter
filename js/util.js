(function(window, CONSTANT, undefined) {
	var Util = {
		removeDialog: function(shelter) {
			shelter.addClass('fadeOut');
			setTimeout(function() {
				shelter.remove();
			}, 1000);
		},

		createDialog: function(text) {
			var _this = this,
				shelter = $$('<div>'),
				html;

			html = '<div class = "dialog">' +
				'<div class = "dialog-content">' +
				'<p>' + text +
				'</p>' +
				'</div>' +
				'<div class = "dialog-btn">' + '确定' +
				'</div>' +
				'</div>';

			shelter.addClass('dialog-shelter fadeIn');
			shelter[0].innerHTML = html;
			document.body.appendChild(shelter[0]);
			$$('.dialog-btn').on('mouseup', function() {
				_this.removeDialog(shelter);
			});
		},

		createConfirmDialog: function(phone, func) {
			var _this = this,
				shelter = $$('<div>'),
				html;

			html = '<div class = "dialog confirm-dialog">' +
				'<div class = "dialog-content confirm-dialog-content">' +
				'<p>' + '确认手机号码' +
				'</p>' +
				'<p>' + '我们将发送验证码短信到这个号码：' +
				'</p>' +
				'<p>' + phone +
				'</p>' +
				'</div>' +
				'<div class = "dialog-btn-group">' +
				'<div class = "confirm-dialog-btn dialog-close">' + '取消' +
				'</div>' +
				'<div class = "confirm-dialog-btn dialog-confirm">' + '确定' +
				'</div>' +
				'</div>' +
				'</div>';

			shelter.addClass('dialog-shelter fadeIn');
			shelter[0].innerHTML = html;
			document.body.appendChild(shelter[0]);
			$$('.dialog-close').on('mouseup', function() {
				_this.removeDialog(shelter);
			});
			$$('.dialog-confirm').on('mouseup', function() {
				func(phone);
				_this.removeDialog(shelter);
			});
		},

		showErrorMsg: function() {
			var div = $$('<div>'),
				label = $$('<label>');

			label[0].innerHTML = '网络不给力，请稍后再试';
			div.addClass('offline-hint fadeInAndOut');
			div[0].appendChild(label[0]);
			document.body.appendChild(div[0]);
		},

		matchPhone: function(value) {
			var reg = /^[1][358][0-9]{9}$/;
			return reg.test(value);
		},

		matchPassword: function(value) {
			var reg = /^[^\u4e00-\u9fa5]{0,}$/;
			return reg.test(value);
		},

		matchMail: function(value) {
			var reg = /(^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+)|(^$)/;
			return reg.test(value);
		},

		getHash: function() {
			return window.location.hash.substring(2);
		},

		getJsonData: function(data) {
			return typeof data == 'string' ? JSON.parse(data) : data;
		},

		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},

		sendVerifyCode: function(params) {
			params.path = 'messages?according=' + params.phone + '&type=PHONE';
			params.type = 'get';
			return this.ajax(params);
		},

		verifyCodeAndPhone: function(params) {
			params.path = 'messages';
			params.type = 'post';
			return this.ajax(params);
		},

		verifyAccountName: function(params) {
			params.path = 'tenants/' + CONSTANT.TENANT_ID + '/user/' + params.name + '/verify';
			params.type = 'get';
			return this.ajax(params);
		},

		register: function(params) {
			params.path = 'tenants/user';
			params.type = 'post';
			return this.ajax(params);
		},

		completeAccountMsg: function(params) {
			params.path = 'tenants/user/improve';
			params.type = 'post';
			return this.ajax(params);
		},

		ajax: function(params) {
			params.url = CONSTANT.BASEPATH + params.path;

			if (params.type == 'post') {
				params.data.tenant_id = CONSTANT.TENANT_ID;
			}

			params.error = Util.showErrorMsg;
			return $$.ajax(params);
		}

	};
	window.Util = Util;
})(window, CONSTANT);