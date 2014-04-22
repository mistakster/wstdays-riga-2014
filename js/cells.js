(function (window) {

	var App = window.App = (window.App || {});

	App.Cells = function (el, viewWidth, viewHeight) {
		viewWidth = viewWidth || el.clientWidth;
		viewHeight = viewHeight || el.clientHeight;

		var renderer = Physics.renderer('canvas', {
			el: el,
			width: viewWidth,
			height: viewHeight,
			meta: false,
			debug: false,
			styles: {
				'circle': {
					strokeStyle: 'hsla(60, 37%, 17%, 1)',
					lineWidth: 1,
					fillStyle: 'hsla(60, 37%, 57%, 0.8)',
					angleIndicator: false
				}
			}
		});

		var world = new Physics();
		world.pause();
		world.add(renderer);
		world.add(
			Physics.behavior('edge-collision-detection', {
				aabb: Physics.aabb(0, 0, viewWidth, viewHeight),
				restitution: 0.99,
				cof: 0.99
			})
		);
		world.add(Physics.behavior('body-impulse-response'));
		world.add(Physics.behavior('newtonian', { strength: 1 }));
		world.add(Physics.behavior('sweep-prune'));
		world.add(Physics.behavior('body-collision-detection', { checkAll: false }));

		Physics.util.ticker
			.subscribe(function (time, dt) {
				if (!world.isPaused()) {
					world.step(time);
					world.render();
				}
			})
			.start();

		var lastTime = new Date();

		world.subscribe('step', function () {
			var now = new Date();
			if (now - lastTime < 2000) {
				return;
			}

			lastTime = now;

			var cell = Physics.body('circle', {
				x: Physics.util.random(viewWidth),
				y: Physics.util.random(viewHeight),
				mass: 1,
				radius: 40,
				vx: Physics.util.random(0.01) - 0.005,
				vy: Physics.util.random(0.01) - 0.005,
				restitution: 0.7
			});

			setTimeout(function () {
				cell.view = renderer.createView(cell.geometry, {
					strokeStyle: 'hsla(40, 37%, 17%, 1)',
					lineWidth: 1,
					fillStyle: 'hsla(40, 37%, 57%, 0.8)',
					angleIndicator: false
				})
			}, 30000);

			setTimeout(function () {
				cell.view = renderer.createView(cell.geometry, {
					strokeStyle: 'hsla(0, 37%, 17%, 1)',
					lineWidth: 1,
					fillStyle: 'hsla(0, 37%, 57%, 0.8)',
					angleIndicator: false
				})
			}, 50000);

			setTimeout(function () {
				world.remove(cell);
			}, 60000);

			world.add(cell);
		});

		return world;
	};

}(window));
