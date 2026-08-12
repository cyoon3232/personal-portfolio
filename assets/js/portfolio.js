(function () {
	'use strict';

	var hero = document.getElementById('hero');
	var nav = document.getElementById('nav');
	var main = document.getElementById('main');
	var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
	var scrollDuration = 1000;
	var scrollLockUntil = 0;

	function navOffset() {
		if (!nav || nav.classList.contains('nav-hidden')) {
			return 0;
		}

		return nav.offsetHeight;
	}

	function easeInOutQuad(t) {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}

	function smoothScrollTo(targetY) {
		var startY = window.scrollY;
		var distance = targetY - startY;
		var startTime = performance.now();

		function step(now) {
			var elapsed = now - startTime;
			var progress = Math.min(elapsed / scrollDuration, 1);

			window.scrollTo(0, startY + distance * easeInOutQuad(progress));

			if (progress < 1) {
				requestAnimationFrame(step);
			}
		}

		requestAnimationFrame(step);
	}

	function scrollToSection(hash) {
		var section = document.querySelector(hash);

		if (!section) {
			return;
		}

		var targetY = section.getBoundingClientRect().top + window.scrollY - navOffset();
		smoothScrollTo(targetY);
	}

	function updateHeroNav() {
		if (!hero || !nav) {
			return;
		}

		var pastHero = window.scrollY > hero.offsetHeight * 0.55;
		nav.classList.toggle('nav-hidden', !pastHero);
	}

	function updateNavAlt() {
		if (!main || !nav) {
			return;
		}

		nav.classList.toggle('alt', main.getBoundingClientRect().top <= 0);
	}

	function setActiveNavLink(hash) {
		navLinks.forEach(function (link) {
			link.classList.toggle('active', link.getAttribute('href') === hash);
		});
	}

	function sectionTop(section) {
		return section.getBoundingClientRect().top + window.scrollY;
	}

	function onScroll() {
		updateHeroNav();
		updateNavAlt();

		if (Date.now() < scrollLockUntil) {
			return;
		}

		var offset = navOffset();
		var marker = window.scrollY + offset + window.innerHeight * 0.15;
		var currentHash = null;

		navLinks.forEach(function (link) {
			var section = document.querySelector(link.getAttribute('href'));

			if (!section) {
				return;
			}

			var top = sectionTop(section);
			var bottom = top + section.offsetHeight;

			if (marker >= top && marker < bottom) {
				currentHash = link.getAttribute('href');
			}
		});

		if (currentHash) {
			setActiveNavLink(currentHash);
		} else if (hero && window.scrollY < hero.offsetHeight * 0.45) {
			navLinks.forEach(function (link) {
				link.classList.remove('active');
			});
		}
	}

	function bindSmoothScroll(selector) {
		document.querySelectorAll(selector).forEach(function (link) {
			link.addEventListener('click', function (event) {
				var href = link.getAttribute('href');

				if (!href || href.charAt(0) !== '#') {
					return;
				}

				event.preventDefault();
				scrollLockUntil = Date.now() + scrollDuration + 100;
				setActiveNavLink(href);
				scrollToSection(href);
			});
		});
	}

	window.addEventListener('load', onScroll);

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);

	bindSmoothScroll('a.scrolly');
	bindSmoothScroll('#nav a[href^="#"]');
	bindSmoothScroll('#hero .hero-rail a[href^="#"]');
})();
