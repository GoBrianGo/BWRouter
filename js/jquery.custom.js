/*
jquery.custom.js (类jquery的方法集合)

以下这些方法是基本和jquery的使用一样
addClass: function(){},
removeClass: function(){},
parents: function(){},
hasClass: function(){},
find: function(){},
on: function(){},
one: function(){},
show: function(){},
hide: function(){},
remove: function(){},
css: function(){},//只能用来获取样式不能设置样式

$$.ajax: function(){} //ajax请求

基本使用方法：
$$(selector).on();
当需要获取没有封装成方法的原生操作的时候：
$$(selector)[0].value
因为$$(selector)是一个数组，当使用有定义的方法的时候才能直接调用，当如获取value的时候，因为没有封装所以需要获取到具体dom对象再调用原生属性
*/
(function(window, undefined) {
	function hasClass(classes, targetClass) {
		return ((' ' + classes + ' ').indexOf(' ' + targetClass + ' ')) != -1;
	}

	function judegIfTarget(target, selector) {
		if (selector) {
			var type = selector[0];
			if (type === '#' && target.id == selector.substring(1)) {
				return true;
			} else if (type === '.' && hasClass(target.className, selector.substring(1))) {
				return true;
			} else if (target.tagName == selector.toLocaleUpperCase()) {
				return true;
			}
			return false;
		}
		return true;
	}

	function getXmlHttp() {
		if (window.ActiveXObject) {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} else if (window.XMLHttpRequest) {
			return new XMLHttpRequest();
		}
	}

	function getStyle(elem, style) {
		return elem.style[style] ? elem.style[style] : window.getComputedStyle(elem)[style];
	}

	// data cache
	var DataCache = {
		styleCache: {}
	};

	var $$ = function(selector) {
		return new $$.prototype.getSelector(selector);
	};

	$$.prototype = {
		constructor: $$,

		length: 0,

		getSelector: function(selector, parent) {
			var _parent = parent ? parent : document;
			if (selector && typeof selector == 'string') {
				var type = selector[0];
				if (type === '#') {
					this.length = 1;
					this[0] = _parent.getElementById(selector.substring(1));
				} else if (type === '.') {
					this.length = 0;
					this.push.apply(this, _parent.getElementsByClassName(selector.substring(1)));
				} else if (type === '<' && selector[selector.length - 1] === '>') {
					this.length = 0;
					this.push(document.createElement(selector.substring(1, selector.length - 1)));
					console.log(this);
				} else {
					this.length = 0;
					this.push.apply(this, _parent.getElementsByTagName(selector));
				}
				return this;
			}

			if (selector && typeof selector == 'object') {
				if (toString.call(selector) == '[object Array]') {
					this.push.apply(this, selector);
					return this;
				}
				this.length = 1;
				this[0] = selector;
				return this;
			}
		},

		addClass: function(name) {
			for (var i = 0; elem = this[i]; i++) {
				if (!$$(elem).hasClass(name)) {
					var className = elem.className;
					elem.className = className ? className + ' ' + name : '' + name;
				}
			}
			return this;
		},

		removeClass: function(name) {
			for (var i = 0; elem = this[i]; i++) {
				var className = elem.className;
				elem.className = (' ' + className + ' ').replace(' ' + name + ' ', ' ').replace(/(^\s*)|(\s*$)/g, "");
			}
			return this;
		},

		find: function(selector) {
			var result = [],
				_this = [];

			[].push.apply(_this, this);

			for (var i = 0; elem = _this[i]; i++) {
				[].push.apply(result, this.getSelector(selector, elem));
			}
			return result;
		},

		parents: function(selector) {
			var result = [],
				_this = [];

			[].push.apply(_this, this);

			for (var i = 0; elem = _this[i]; i++) {
				while (elem.parentElement) {
					if (elem.parentElement) {
						result.push(elem.parentElement);
						elem = elem.parentElement;
						if (selector && judegIfTarget(elem, selector)) {
							return elem;
						}
					}
				}
			}
			return result;
		},

		hasClass: function(className) {
			var target = this[0],
				classes = target.className;

			return hasClass(classes, className);
		},

		on: function(type, selector, handler, one) {

			if (typeof selector == 'function') {

				handler = selector;

				if (typeof handler == 'number') {
					one = handler;
				}

				var fn = handler;

				handler = function() {
					fn();
					if (one == 1) {
						this.removeEventListener(type, handler);
					}
				};

				for (var i = 0; elem = this[i]; i++) {
					elem.addEventListener(type, handler, false);
				}

			}

			if (typeof selector == 'string') {

				var fn = handler;

				handler = function() {

					if (judegIfTarget(event.target, selector)) {
						fn();
					}

					if (one == 1) {
						this.removeEventListener(type, handler);
					}
				};

				for (var i = 0; elem = this[i]; i++) {
					elem.addEventListener(type, handler, false);
				}
			}

		},

		one: function(type, handler, selector) {
			this.on(type, handler, selector, 1);
		},

		css: function(style) {
			var elem = this[0];
			return getStyle(elem, style);
		},

		show: function() {
			for (var i = 0; elem = this[i]; i++) {
				var display = DataCache.styleCache[elem];
				elem.style.display = display ? display : 'block';
			}
		},

		hide: function() {
			for (var i = 0; elem = this[i]; i++) {
				var display = getStyle(elem, 'display');
				if (display != 'none') {
					DataCache.styleCache[elem] = display;
				}
				elem.style.display = 'none';
			}
		},

		remove: function() {
			for (var i = 0; elem = this[i]; i++) {
				elem.parentElement.removeChild(elem);
			}
		},

		push: [].push,
		sort: [].sort,
		splice: [].splice
	};

	/*
	使用方法： $$.ajax(params).success(callback);
	params: 和jquery一样的参数设置，只不过成功回调写成了promise形式，而失败回调还是写在params的error字段
	*/
	$$.ajax = function(params) {
		var post_data = null,
			xmlHttp;

		xmlHttp = getXmlHttp();
		xmlHttp.open(params.type, params.url);

		if (params.type == 'post') {
			post_data = JSON.stringify(params.data);
			xmlHttp.setRequestHeader("Content-Type", params.contentType || 'application/json');
		}

		xmlHttp.send(post_data);
		xmlHttp.success = function(func) {
			xmlHttp.onreadystatechange = function() {
				if (xmlHttp.readyState == 4) {
					if (xmlHttp.status == 200) {
						func(xmlHttp.responseText);
					} else {
						params.error && params.error();
					}
				}
			};
			return xmlHttp;
		};
		return xmlHttp;
	};

	$$.prototype.getSelector.prototype = $$.prototype;

	window.$$ = $$;

})(window);