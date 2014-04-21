// event bus
(function (s) {

	var storage = {};

	s.on = function(name, callback, context) {
		var events = storage[name] || (storage[name] = []);
		events.push({callback: callback, context: context, ctx: context || this});
		return this;
	};

	s.off = function(name, callback, context) {
		var retain, ev, events, names, l, i, j;

		if (events = storage[name]) {
			storage[name] = retain = [];
			if (callback || context) {
				for (j = 0, i = events.length; j < i; j++) {
					ev = events[j];
					if ((callback && callback !== ev.callback) || (context && context !== ev.context)) {
						retain.push(ev);
					}
				}
			}
			if (!retain.length) {
				delete storage[name];
			}
		}

		return this;
	};

	s.trigger = function (name) {
		var args = slice.call(arguments, 1);
		var events = storage[name];
		var allEvents = storage.all;
		if (events) {
			triggerEvents(events, args);
		}
		if (allEvents) {
			triggerEvents(allEvents, arguments);
		}
		return this;
	};

	var slice = [].slice;

	var triggerEvents = function(events, args) {
		var ev, i = -1, l = events.length;
		while (++i < l) {
			ev = events[i];
			ev.callback.apply(ev.ctx, args);
		}
	};

}(window.shower));


// aspect weaver
(function (s) {

	function weaver(method) {
		var original = s[method];
		s[method] = function () {
			s.trigger(method + ':before');
			original.apply(this, arguments);
			s.trigger(method + ':after');
		}
	}

	weaver('go');

}(window.shower));