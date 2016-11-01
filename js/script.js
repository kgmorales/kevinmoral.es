$(function() {

  var fonts = "https://fonts.googleapis.com/css?family=Open+Sans:400,700";
    if (document.createStyleSheet) document.createStyleSheet(fonts);
    else $("head").append($("<link rel='stylesheet' href='"+ fonts +"' type='text/css' media='screen' />"));

  $("button").click(function() {
    $(".hamburger").toggleClass("focus");
    $(".content").toggleClass("show");
  });

  $("nav").click(function() {
    $(".content").toggleClass('show');
    $(".hamburger").toggleClass("focus");
  });
});

// i like pizza
(function addPizza(){
	if (navigator.userAgent.indexOf('Mac OS X') != -1) {
    window.location.hash = "🍕";
  }
})();
