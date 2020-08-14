$(function () {
	$('button').click(function () {
		$('.hamburger').toggleClass('focus');
		$('.content').toggleClass('show');
	});

	$('nav').click(function () {
		$('.content').toggleClass('show');
		$('.hamburger').toggleClass('focus');
	});
});

(function addMe() {
	var macOSX = navigator.userAgent.indexOf('Mac OS X') !== -1;
	var firefox = navigator.userAgent.indexOf('FireFox') !== -1;
	var mobile = typeof window.orientation !== 'undefined';
	if (macOSX && firefox && !mobile) {
		window.location.hash = '👨🏽‍💻';
	}
})();
