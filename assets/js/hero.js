/*
	Hero interactions: pointer tilt on the portrait, a magnetic CTA,
	and a scroll cue that fades once the visitor starts scrolling.
	Vanilla JS, rAF-throttled, and fully inert for touch / reduced-motion.
*/

(function () {

	// Safety net: the theme reveals content by removing body.is-preload on
	// window 'load' (+100ms, via jQuery). That's a single point of failure —
	// a slow/blocked/erroring script leaves [data-reveal] stuck at opacity:0
	// forever. Back it up with an independent timer so content always shows.
	window.setTimeout(function () {
		document.documentElement.classList.add('hero-ready');
	}, 700);

	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

	if (reduceMotion || !canHover) return;

	var portrait = document.querySelector('.hero-portrait');
	var portraitImage = document.querySelector('.hero-portrait-image');
	var cta = document.querySelector('.hero-cta');
	var scrollCue = document.querySelector('.hero-scroll-cue');

	var ticking = false;
	var pending = null;

	function apply() {
		ticking = false;
		if (!pending) return;

		if (pending.type === 'tilt' && portraitImage) {
			portraitImage.style.setProperty('--rx', pending.rx + 'deg');
			portraitImage.style.setProperty('--ry', pending.ry + 'deg');
		}

		if (pending.type === 'magnet' && cta) {
			cta.style.setProperty('--mx', pending.mx + 'px');
			cta.style.setProperty('--my', pending.my + 'px');
		}
	}

	function queue(update) {
		pending = update;
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(apply);
		}
	}

	if (portrait && portraitImage) {
		portrait.addEventListener('mousemove', function (e) {
			var rect = portrait.getBoundingClientRect();
			var x = (e.clientX - rect.left) / rect.width - 0.5;
			var y = (e.clientY - rect.top) / rect.height - 0.5;
			queue({ type: 'tilt', rx: (x * 16).toFixed(2), ry: (-y * 16).toFixed(2) });
		});

		portrait.addEventListener('mouseleave', function () {
			queue({ type: 'tilt', rx: 0, ry: 0 });
		});
	}

	if (cta) {
		cta.addEventListener('mousemove', function (e) {
			var rect = cta.getBoundingClientRect();
			var x = (e.clientX - rect.left) / rect.width - 0.5;
			var y = (e.clientY - rect.top) / rect.height - 0.5;
			queue({ type: 'magnet', mx: (x * 12).toFixed(2), my: (y * 10).toFixed(2) });
		});

		cta.addEventListener('mouseleave', function () {
			queue({ type: 'magnet', mx: 0, my: 0 });
		});
	}

	if (scrollCue) {
		var hideAt = 80;
		var onScroll = function () {
			scrollCue.classList.toggle('is-hidden', window.scrollY > hideAt);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
	}

})();
