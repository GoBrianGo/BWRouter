WebApp.on('register.loaded', function() {
	var phoneValidate = true,
		codeValidate = true;
	var Register = {
		init: function() {
			this.bindEvents();
			this.bindDelegateEvents(); //绑定委托事件
		},

		bindEvents: function() {
			var backBtn = $$('#back-to-login'),
				registerBtn = $$('#register-btn'),
				phoneInput = $$('#phone-number'),
				verificationInput = $$('.verfication-code-input'),
				verificationBtn = $$('.verfication-code-btn');

			backBtn.on('mouseup', this.goBack);
			registerBtn.on('mouseup', this.registerHandler);
			phoneInput.on('input', this.phoneInputHandler.bind(this));
			verificationInput.on('input', this.checkVerificationFormat.bind(this));
			verificationBtn.on('mouseup', this.showDialog.bind(this));
		},

		bindDelegateEvents: function() {
			var app = $$('#app');
			app.on('mouseup', '.msg-delete-box', this.clearInputText.bind(this));
		},

		clearInputText: function() {
			var target = event.target,
				btn = $$('.verfication-code-btn');

			$$(target.parentElement).find('input')[0].value = '';
			$$($$(target).find('.icon-delete')).addClass('hide');
			this.checkPhoneFormat(btn, $$('#phone-number')[0]);
			this.checkIfCanSubmit();
		},

		goBack: function() {

		},

		registerHandler: function() {
			var phone = $$('#phone-number')[0].value.trim(),
				code = $$('.verfication-code-input')[0].value.trim(), params;

			params = {
				data: {
					type: "PHONE",
					code: "123456",
					according: phone
				}
			};

			Util.verifyCodeAndPhone(params).success(function(data) {
				var result = Util.getJsonData(data),
					status = result.status;

				if (status == CONSTANT.AJAX_SUCCESS) {
					var headerText = $$('.header-middle-part')[0];
					headerText.innerHTML = '设置帐号信息';
					window.location.href = '#/account-msg/' + $$('#phone-number')[0].value.trim();
				}

			});

		},

		phoneInputHandler: function() {
			var target = event.target,
				value = target.value.trim(),
				btn = $$('.verfication-code-btn'),
				deleteBtn = $$($$($$(target).parents('.msg-box')).find('.icon-delete')[0]); //找到与input同一个parent下的delete icon

			this.checkPhoneFormat(btn, target);

			if (value) {
				deleteBtn.removeClass('hide');
			} else {
				deleteBtn.addClass('hide');
			}

			this.checkIfCanSubmit();
		},

		checkPhoneFormat: function(btn, target) {
			if (Util.matchPhone(target.value.trim())) {
				phoneValidate = true;
				btn.addClass('active');
				btn[0].disabled = false;
			} else {
				btn.removeClass('active');
				btn[0].disabled = true;
				phoneValidate = false;
			}
		},

		checkVerificationFormat: function() {
			var target = event.target;
			value = target.value.trim();

			if (value) {
				codeValidate = true;
			} else {
				codeValidate = false;
			}

			this.checkIfCanSubmit();
		},

		checkIfCanSubmit: function() {
			var btn = $$('#register-btn');

			if (phoneValidate && codeValidate) {
				btn.addClass('active');
				btn[0].disabled = false;
				return;
			}
			btn.removeClass('active');
			btn[0].disabled = true;
		},

		showDialog: function() {
			var phone = $$('#phone-number')[0];
			Util.createConfirmDialog(phone.value.trim(), this.sendVerificationCode.bind(this));
		},

		sendVerificationCode: function() {
			this.sendVerifyCode();
		},

		sendVerifyCode: function() {
			var _this = this,
				phone = $$('#phone-number')[0].value.trim(),
				params;

			params = {
				phone: phone
			};

			Util.sendVerifyCode(params).success(function(data) {
				var result = Util.getJsonData(data),
					status = result.status;

				if (status == CONSTANT.AJAX_SUCCESS) {
					_this.setCountDown();
				}
			});
		},

		setCountDown: function() {
			var _this = this,
				btn = $$('.verfication-code-btn'),
				duration = CONSTANT.MSG_DURATION,
				interval;

			btn.addClass('disabled');
			btn[0].disabled = false;
			btn[0].innerHTML = '重新获取(' + duration + 'S)';
			interval = setInterval(function() {
				duration--;
				btn[0].innerHTML = '重新获取(' + duration + 'S)';
				if (duration == 0) {
					clearInterval(interval);
					btn[0].innerHTML = '获取验证码';
					btn.removeClass('disabled');
					_this.checkPhoneFormat(btn, $$('#phone-number')[0]);
				}
			}, 1000);
		}

	};
	Register.init();
});