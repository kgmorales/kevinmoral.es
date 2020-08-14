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
	var chrome = navigator.userAgent.indexOf('Chrome') !== -1;
	var mobile = typeof window.orientation !== 'undefined';
	if (macOSX && !chrome && !mobile) {
		window.location.hash = '👨🏽‍💻';
	}
})();
