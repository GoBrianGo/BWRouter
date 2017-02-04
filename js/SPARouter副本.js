/*
A publish-subscribe pattern
It's used to inform the front to bind events when a page finishes loading
*/
(function(window, undefined) {
    function getCamelCase(str) {
        var arr = str.split('-'),
            result = arr[0];
        for (var i = 1; i < arr.length; i++) {
            result = result + arr[i].charAt(0).toUpperCase() + arr[i].substring(1);

        }
        return result;
    }
    var WebApp = {
        subscribes: {},
        pub: function(evt, data) {
            evt = getCamelCase(evt) + '.loaded';
            var subscribes = this.subscribes[evt];
            if (subscribes) {
                for (var i = 0, len = subscribes.length; i < len; i++) {
                    if (typeof(subscribes[i]) === 'function') {
                        subscribes[i](data);
                    }
                };
            }
        },
        on: function(evt, fn) {
            this.subscribes[evt] ? this.subscribes[event].push(fn) : this.subscribes[evt] = [fn];
        }
    };
    window.WebApp = WebApp;
})(window);

/*
a simple and lightweight routers
use hash to router pages
*/
(function(window, undefined) {

    function popStateCallBack(e) {
    }

    function hashChangeCallBack(e) {
        var _this = SPARouter;
        console.log(e);
        var hash = e.newURL.split('#')[1];
        // _this.pushViews(_this,hash);
        if (_this.views.length >= 2 && _this.views[_this.views.length - 2].hash == hash) {
            pushViews(hash);
            console.log(1);
            return;
        }
        _this.routers.map(function(item, index) {
            var url, hash, realHash, param = {};
            url = realHash = item.url;
            hash = e.newURL.split('#')[1];

            if (url.indexOf(':') != -1) {
                realHash = url.split('/:')[0];
                param[url.split('/:')[1]] = hash.replace(url.split(':')[0], '').trim();
                hash = hash.substring(0, realHash.length);
            }

            if (hash == realHash) {
                ajaxHtml(item.templateHtml, hash, param);
                return;
            }

        })
    }

    function pushViews(hash, id) {
        var _this = SPARouter;
        var length = _this.views.length;
        var data = {
            hash: hash,
            id: id
        };
        if (length < 2 || _this.views[length - 2].hash != hash) {
            _this.views.push(data);
            _this.state = 'forward';
            return;
        }
        _this.views.pop();
        _this.state = 'back';
        animatePages();
    }

    function ajaxHtml(path, hash, param) {
        var _this = SPARouter,
            id = hash.substring(1),
            params = {
                url: path,
                type: 'get'
            };

        $$.ajax(params).success(function(data) {
            pushViews(hash, id);
            animatePages(data, id, param);
        });
    }

    function animatePages(data, id, param) {
        var _this = SPARouter,
            animation_in_class = 'slideOutRight animated',
            animation_out_class = 'slideInLeft animated',
            page = $$('.current'),
            app = $$('#app')[0];

        if (data) {
            page = $$('<div>');
            page.addClass('page');
            page[0].innerHTML = data;
            page[0].id = id;
        }

        if (_this.views.length === 1 && _this.state === 'forward') {
            app.appendChild(page[0]);
            page.addClass('current');
            WebApp.pub(id, param);
            return;
        }

        if (_this.state === 'forward') {
            animation_class = 'slideInRight animated';
            animation_out_class = 'slideOutLeft animated',
            app.appendChild(page[0]);
            WebApp.pub(id, param);
        }

        page.addClass(animation_class);
        $$('.current').addClass(animation_out_class);
        page.one('webkitAnimationEnd', function() {
            var id = _this.views[_this.views.length - 1].id;
            if (_this.state === 'forward') {
                $$('.current').removeClass('current ' + animation_out_class);
                page.removeClass(animation_class);
                page.addClass('current');
                return;
            }
            page.remove();
            $$('#' + id).addClass('current');
        });
    }

    var SPARouter = {
        routers: [],
        views: [],
        state: '',

        //insert routers
        route: function(state) {
            [].push.apply(this.routers, state);
        },

        bindRoute: function() {
            window.addEventListener('hashchange', hashChangeCallBack, false);
            window.addEventListener('popstate', popStateCallBack, false);
        },

        //insert the default routers (this first loading page)
        defaultRoute: function(state) {
            var url = window.location.href;
            this.routers.push(state);
            window.location.href = '#' + state.url;
            if (url == window.location.href) {
                hashChangeCallBack({
                    newURL: window.location.href
                });
            }

        }
    };

    SPARouter.bindRoute();
    window.SPARouter = SPARouter;
})(window);