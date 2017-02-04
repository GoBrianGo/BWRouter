WebApp.on('accountMsg.loaded', function(data) {
	var accountValidate = true,
		passwordValidate = false; // 用来判断是否可以提交数据
	var AccountMsg = {
		init: function() {
			this.bindEvents();
			this.setAccountName();
		},

		setAccountName: function() {
			var accountName = $$('#account-name')[0];
			accountName.value = data.accountName;
			this.checkAccountName(data.accountName);
		},

		bindEvents: function() {
			var submitAccuntMsg = $$('#submit-account-msg'),
				accountNameInput = $$('#account-name'),
				accountPassword = $$('.account-password'),
				passwordShowType = $$('.icon-password-type'),
				backBtn = $$('#back-to-register-page');

			submitAccuntMsg.on('mouseup', this.submitAccountMsgHandler);
			passwordShowType.on('mouseup', this.togglePasswordShowType);
			accountNameInput.on('blur', this.checkAccountName.bind(this));
			accountPassword.on('blur', this.checkPasswordLength.bind(this));
			accountPassword.on('focus', this.accountPasswordHandler.bind(this))
			accountPassword.on('input', this.accountPasswordHandler.bind(this));
			backBtn.on('mouseup', this.goBack);

		},

		goBack: function() {
			window.history.back();
		},

		submitAccountMsgHandler: function() {
			var headerText = $$('.header-middle-part')[0],
				headerRightText = $$('.header-right-part')[0],
				accountName = $$('#account-name')[0].value,
				password = $$('.account-password')[0].value.trim(),
				params;

			params = {
				data: {
					username: accountName,
					password: password,
					re_password: password
				}
			};
			
			Util.register(params).success(function(data) {
				var result = Util.getJsonData(data),
					status = result.status;

				if (status == CONSTANT.AJAX_SUCCESS) {
					headerText.innerHTML = '设置用户信息';
					window.location.href = '#/personal-msg/' + accountName;
				}
			});

		},

		//检测用户名是否存在
		checkAccountName: function(name) {
			var _this = this,
				target = event.target,
				hintIcon = $$('#icon-account-hint'),
				accountMsgHint = $$('#account-msg-hint'),
				params = {
					name: name ? name : target.value.trim()
				};

			Util.verifyAccountName(params).success(function(data) {
				var result = Util.getJsonData(data),
					status = result.status;

				if (status == CONSTANT.CAN_REGISTER) {
					hintIcon.removeClass('icon-unavailable-name');
					hintIcon.addClass('icon-available-name');
					accountMsgHint.hide();
					accountValidate = true;
				} else {
					hintIcon.removeClass('icon-available-name');
					hintIcon.addClass('icon-unavailable-name');
					accountMsgHint[0].innerHTML = '用户已被注册';
					accountMsgHint.show();
					accountValidate = false;
				}
				_this.checkIfCanSubmit();
			});

		},

		checkIfCanSubmit: function() {
			var btn = $$('#submit-account-msg');

			if (accountValidate && passwordValidate) {
				btn.addClass('active');
				btn[0].disabled = false;
				return;
			}
			btn.removeClass('active');
			btn[0].disabled = true;
		},

		checkPasswordLength: function() {
			var target = event.target,
				value = target.value.trim();

			this.changePasswordHintType(target, 'icon-unavailable-name');

		},

		accountPasswordHandler: function() {
			var target = event.target;
			this.hideErrorText();
			this.checkAccountPassword(target);
			this.formatPasswordInput(target);
			this.compareTwoPasswords();
			this.checkIfCanSubmit();
		},

		formatPasswordInput: function(target) {
			target.value = target.value.replace(/[\u4e00-\u9fa5]/g, '');
		},

		checkAccountPassword: function(target) {
			var password = $$($$($$(target).parents('.msg-box')).find('.icon-password-type')),
				type = target.type,
				className;

			if (target.value.trim()) {
				if (type == 'text') {
					className = 'icon-password-visible';
				} else {
					className = 'icon-password-invisible';
				}
				password[0].className = 'custom-icon icon-password-type ' + className;
				return;
			}
			password[0].className = 'custom-icon icon-password-type';
		},

		compareTwoPasswords: function() {
			var passwords = $$('.account-password'),
				passwordOne = passwords[0].value.trim(),
				passwordTwo = passwords[1].value.trim();

			if ((passwordOne.length >= CONSTANT.PASSWORD_LENGTH) && (passwordTwo.length >= CONSTANT.PASSWORD_LENGTH) && (passwordOne === passwordTwo)) {
				passwordValidate = true;
				return true;
			}

			passwordValidate = false;
			return false;
		},

		//根据密码输入情况显示错误信息或隐藏错误信息
		changePasswordHintType: function(target, className) {
			var passwords = $$('.account-password'),
				passwordOne = passwords[0].value.trim(),
				passwordTwo = passwords[1].value.trim(),
				currentPassword = $$($$($$(target).parents('.msg-box')).find('.icon-password-type')),
				length = target.value.trim().length,
				accountMsgHint = $$('#account-msg-hint');

			if (length < CONSTANT.PASSWORD_LENGTH && length > 0) {
				this.showErrorMsg('至少输入六位数密码');
				return;
			}

			if (length == 0) {
				this.showErrorMsg('密码不能为空');
				return;
			}

			if (!this.compareTwoPasswords() && passwordOne && passwordTwo) {
				this.showErrorMsg('两次密码不一致', passwords[1]);
				return;
			}

			// currentPassword[0].className = 'custom-icon icon-password-type';
			accountMsgHint.hide();
		},

		showErrorMsg: function(text, _target) {
			var target = _target ? _target : event.target,
				password = $$($$($$(target).parents('.msg-box')).find('.icon-password-type'))[0],
				accountMsgHint = $$('#account-msg-hint');

			password.className = 'custom-icon icon-password-type icon-unavailable-name';
			accountMsgHint[0].innerHTML = text;
			accountMsgHint.show();
		},

		hideErrorText: function() {
			var accountMsgHint = $$('#account-msg-hint');
			accountMsgHint.hide();
		},

		togglePasswordShowType: function() {
			var target = $$(event.target),
				password = $$(target.parents('.msg-box')).find('input')[0];

			if (target.hasClass('icon-password-invisible')) {
				password.type = 'text';
				target.removeClass('icon-password-invisible');
				target.addClass('icon-password-visible');
				return;
			}
			password.type = 'password';
			target.removeClass('icon-password-visible');
			target.addClass('icon-password-invisible');
		}
	};
	AccountMsg.init();
});