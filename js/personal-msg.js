WebApp.on('personalMsg.loaded', function(data) {
	var PersonalMsg = {
		init: function() {
			this.bindEvents();
		},

		bindEvents: function() {
			var submitBtn = $$('#submit-personal-msg'),
				mail = $$('#account-mail'),
				backBtn = $$('#back-to-account-page');

			submitBtn.on('mouseup', this.submitPersonalMsg.bind(this));
			mail.on('input', this.mailInputHandler.bind(this));
			backBtn.on('mouseup', this.goBack);
		},

		goBack: function() {
			window.history.back();
		},

		submitPersonalMsg: function() {
			var mail = $$('#account-mail')[0].value.trim(),
				birth = $$('#birth')[0].value,
				accountName = data.accountName,
				name = $$('#real-name')[0].value.trim(),
				gender = this.getUserGender(),
				icon = $$('#mail-hint-icon'),
				errorText = $$('#personal-msg-hint'),
				params;

			if (!Util.matchMail(mail)) {
				icon.addClass('icon-unavailable-name');
				this.showErrorText('邮箱格式不正确');
				return;
			}

			params = {
				data: {
					username: accountName,
					birthday: birth,
					email: mail,
					name: name,
					sex: gender
				}
			};

			Util.completeAccountMsg(params).success(function(data) {
				var result = Util.getJsonData(data),
					status = result.status;

				if (status == CONSTANT.AJAX_SUCCESS) {
					alert('success');
				}
			});
		},

		mailInputHandler: function() {
			var icon = $$('#mail-hint-icon');
			icon[0].className = 'custom-icon';
			this.hideErrorText();
		},

		showErrorText: function(text) {
			var msg = $$('#personal-msg-hint');
			msg[0].innerHTML = text;
			msg.show();
		},

		hideErrorText: function() {
			var msg = $$('#personal-msg-hint');
			msg.hide();
		},

		getUserGender: function() {
			return $$('.gender-radio')[0].checked ? 'male' : 'female';
		}
	};
	PersonalMsg.init();
});