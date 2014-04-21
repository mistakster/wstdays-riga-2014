(function () {

	var $viewport = $('#viewport-cover'),
		viewWidth = $viewport.width(),
		viewHeight = $viewport.height();

	var renderer = Physics.renderer('canvas', {
		el: 'viewport-cover',
		width: viewWidth,
		height: viewHeight,
		meta: false,
		debug: false,
		styles: {
			'circle': {
				strokeStyle: 'hsla(60, 37%, 17%, 1)',
				lineWidth: 1,
				fillStyle: 'hsla(60, 37%, 57%, 0.8)',
				angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
			}
		}
	});

	var edgeBounce = Physics.behavior('edge-collision-detection', {
		aabb: Physics.aabb(0, 0, viewWidth, viewHeight),
		restitution: 0.99,
		cof: 0.99
	});


	var sim = function (world, Physics) {

		function born(x, y) {
			var p = Physics.body('circle', {
				x: x,
				y: y,
				mass: 1,
				radius: 40,
				vx: Physics.util.random(0.01) - 0.005,
				vy: Physics.util.random(0.01) - 0.005,
				restitution: 0.99
			});

			world.add(p);

			setTimeout(function () {
				born(viewWidth / 2, viewHeight / 2);
			}, 500);

		}

		born(viewWidth / 2, viewHeight / 2);

	};

	$(function () {
		Physics.util.ticker.start();
		// initialize the world
		var world = Physics(sim);
		world.pause();
		world.add(renderer);
		world.add(edgeBounce);
		world.add(Physics.behavior('body-impulse-response'));
		world.add(Physics.behavior('newtonian', { strength: .1 }));
		world.add(Physics.behavior('sweep-prune'));
		world.add(Physics.behavior('body-collision-detection', { checkAll: false }));
		Physics.util.ticker.subscribe(function (time, dt) {
			world.step(time);
			if (!world.isPaused()) {
				world.render();
			}
		});
		world.unpause();
	});

}());
