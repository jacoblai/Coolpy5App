/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	owner.ldhPostOrPutForDps = function(url, meth, data, callback) {
		callback = callback || $.noop;
		var state = owner.getState();
		mui.ajax(localStorage.getItem('$svc') + url, {
			dataType: 'json',
			type: meth,
			async: false,
			data: data,
			headers: {
				'Content-Type': 'application/json',
				"U-ApiKey": state.Ukey
			},
			success: function(data) {
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				return callback(new Error(xhr.responseText))
			}
		});
	}

	owner.ldhGetOrDelForDps = function(url, meth, callback) {
		callback = callback || $.noop;
		var state = owner.getState();
		mui.ajax(localStorage.getItem('$svc') + url, {
			dataType: 'json',
			type: meth,
			async: false,
			headers: {
				'Content-Type': 'application/json',
				"U-ApiKey": state.Ukey
			},
			success: function(data) {
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				return callback(new Error(xhr.responseText))
			}
		});
	}

	owner.ldhGetOrDel = function(url, meth, callback) {
		callback = callback || $.noop;
		var state = owner.getState();
		mui.ajax(localStorage.getItem('$svc') + url, {
			dataType: 'json',
			type: meth,
			async: false,
			headers: {
				'Content-Type': 'application/json',
				"Authorization": state.token
			},
			success: function(data) {
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				return callback(new Error(xhr.responseText))
			}
		});
	}

	owner.relogin = function(state, callback) {
			callback = callback || $.noop;
			var w = plus.nativeUI.showWaiting("请等待...");
			$.ajax(localStorage.getItem('$svc') + '/api/user/' + state.Uid, {
				dataType: 'json',
				type: 'get',
				timeout: 5000,
				headers: {
					'Content-Type': 'application/json',
					"Authorization": state.token
				},
				success: function(data) {
					w.close();
					if(data.ok == 1) {
						return callback(undefined);
					} else {
						return callback('用户名或密码错误');
					}
				},
				error: function(xhr, type, errorThrown) {
					w.close();
					return callback(Error(xhr.responseText));
				}
			});
		}
		/**
		 * 用户登录
		 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		regex = /^[a-zA-Z0-9_]{3,128}$/;
		if(!regex.test(loginInfo.account)) {
			return callback('账号验证失败');
		}
		if(!regex.test(loginInfo.password)) {
			return callback('密码验证失败');
		}
		var token = "Basic " + base64.encode(loginInfo.account + ":" + loginInfo.password);
		var w = plus.nativeUI.showWaiting("请等待...");
		$.ajax(localStorage.getItem('$svc') + '/api/user/' + loginInfo.account, {
			dataType: 'json',
			type: 'get',
			timeout: 5000,
			headers: {
				'Content-Type': 'application/json',
				"Authorization": token
			},
			success: function(data) {
				w.close();
				if(data.ok == 1) {
					data.data.Pwd = loginInfo.password;
					data.data.token = token;
					owner.setState(data.data)
					return callback();
				} else {
					return callback(Error('用户名或密码错误'));
				}
			},
			error: function(xhr, type, errorThrown) {
				w.close();
				return callback(Error(xhr.responseText));
			}
		});
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.app = {}));