/*
	Reveals [data-inview] elements as they scroll into view.
	One-shot per element; falls back to revealing everything immediately
	if IntersectionObserver isn't available.
*/

(function () {

	var targets = document.querySelectorAll('[data-inview]');
	if (!targets.length) return;

	if (!('IntersectionObserver' in window)) {
		targets.forEach(function (el) { el.classList.add('is-inview'); });
		return;
	}

	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('is-inview');
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

	targets.forEach(function (el) { observer.observe(el); });

	// Safety net, same rationale as hero.js: never leave content stuck
	// invisible if something above goes wrong.
	window.setTimeout(function () {
		targets.forEach(function (el) { el.classList.add('is-inview'); });
	}, 4000);

})();
