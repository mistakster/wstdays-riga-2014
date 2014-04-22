(function () {

	shower.weaver('go');

	function getCurrentHash() {
		return shower.getSlideHash(shower.getCurrentSlideNumber()).replace('#', '');
	}

	shower.on('go:before', function () {
		shower.trigger('enter:' + getCurrentHash());
	});

	shower.on('go:after', function () {
		shower.trigger('exit:' + getCurrentHash());
	});


	(function () {

		var world = App.Cells('viewport-cover', 1024, 640);

		shower.on('enter:Cover', function () {
			world.unpause();
		});

		shower.on('exit:Cover', function () {
			world.pause();
		});

	}());

}());