(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

	/* ---------------- Custom cursor ---------------- */

	if (!isCoarsePointer) {
		var dot = document.getElementById('cursor-dot');
		var ring = document.getElementById('cursor-ring');
		var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		var ringPos = { x: mouse.x, y: mouse.y };

		window.addEventListener('pointermove', function (e) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
			dot.style.transform = 'translate(' + mouse.x + 'px,' + mouse.y + 'px) translate(-50%,-50%)';
		});

		document.addEventListener('pointerover', function (e) {
			if (e.target.closest && e.target.closest('a, button, .glass-card')) {
				ring.classList.add('is-active');
			}
		});
		document.addEventListener('pointerout', function (e) {
			if (e.target.closest && e.target.closest('a, button, .glass-card')) {
				ring.classList.remove('is-active');
			}
		});

		(function tick() {
			ringPos.x += (mouse.x - ringPos.x) * 0.18;
			ringPos.y += (mouse.y - ringPos.y) * 0.18;
			ring.style.transform = 'translate(' + ringPos.x + 'px,' + ringPos.y + 'px) translate(-50%,-50%)';
			requestAnimationFrame(tick);
		})();
	}

	/* ---------------- Magnetic social icons ---------------- */

	if (!isCoarsePointer && !reduceMotion) {
		document.querySelectorAll('.magnetic').forEach(function (el) {
			el.addEventListener('pointermove', function (e) {
				var rect = el.getBoundingClientRect();
				var relX = e.clientX - (rect.left + rect.width / 2);
				var relY = e.clientY - (rect.top + rect.height / 2);
				el.style.transform = 'translate(' + relX * 0.35 + 'px,' + (relY * 0.35 - 6) + 'px)';
			});
			el.addEventListener('pointerleave', function () {
				el.style.transform = '';
			});
		});
	}

	/* ---------------- Card 3D tilt ---------------- */

	if (!isCoarsePointer && !reduceMotion) {
		var card = document.getElementById('card');
		if (card) {
			window.addEventListener('pointermove', function (e) {
				var rect = card.getBoundingClientRect();
				var px = (e.clientX - rect.left) / rect.width - 0.5;
				var py = (e.clientY - rect.top) / rect.height - 0.5;
				var inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
				var rx = inside ? py * -6 : 0;
				var ry = inside ? px * 8 : 0;
				card.style.transform = 'translateY(0) scale(1) perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
			});
		}
	}

	/* ---------------- Text scramble intro on tagline ---------------- */

	var CHARS = '!<>-_\\/[]{}—=+*^?#________';

	function scramble(el) {
		var finalText = el.getAttribute('data-text') || el.textContent;
		var length = finalText.length;
		var frame = 0;
		var revealed = 0;
		var totalFrames = reduceMotion ? 1 : 36;

		function update() {
			frame++;
			revealed = Math.floor((frame / totalFrames) * length);
			var out = '';
			for (var i = 0; i < length; i++) {
				if (i < revealed) {
					out += finalText[i];
				} else if (finalText[i] === ' ') {
					out += ' ';
				} else {
					out += CHARS[Math.floor(Math.random() * CHARS.length)];
				}
			}
			el.textContent = out;
			if (frame < totalFrames) {
				requestAnimationFrame(update);
			} else {
				el.textContent = finalText;
			}
		}
		update();
	}

	function startIntro() {
		var tagline = document.getElementById('tagline');
		if (tagline) {
			setTimeout(function () {
				scramble(tagline);
			}, 550);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', startIntro);
	} else {
		startIntro();
	}
})();
