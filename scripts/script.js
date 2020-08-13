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
	if (navigator.userAgent.indexOf('Mac OS X') != -1) {
		window.location.hash = '👨🏽‍💻';
	}
})();
