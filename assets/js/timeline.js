/*
	Draws the experience timeline's gradient line as the visitor scrolls.
	Progress tracks a "focus point" 60% down the viewport, so the fill
	stays just ahead of the card being read. rAF-throttled; reduced-motion
	users get the line fully drawn instead of scroll-linked movement.
*/

(function () {

	var timeline = document.querySelector('.timeline');
	var progress = document.querySelector('.timeline-line-progress');
	if (!timeline || !progress) return;

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		progress.style.transform = 'scaleY(1)';
		return;
	}

	var ticking = false;

	function update() {
		ticking = false;
		var rect = timeline.getBoundingClientRect();
		var viewHeight = window.innerHeight || document.documentElement.clientHeight;
		var focus = viewHeight * 0.6;
		var p = (focus - rect.top) / rect.height;
		p = Math.max(0, Math.min(1, p));
		progress.style.transform = 'scaleY(' + p + ')';
	}

	function request() {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(update);
		}
	}

	window.addEventListener('scroll', request, { passive: true });
	window.addEventListener('resize', request, { passive: true });
	update();

})();
