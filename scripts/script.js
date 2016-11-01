(function ($, window, document, undefined) {
  $("button").click(function() {
    $(".hamburger").toggleClass("focus");
    $(".content").toggleClass("show");
  });

  $("nav").click(function() {
    $(".content").toggleClass('show');
    $(".hamburger").toggleClass("focus");
  });

// i like pizza
(function addPizza() {
  if (navigator.userAgent.indexOf('Mac OS X') != -1) {
    window.location.hash = "🍕";
  }
})();

// defer CSS loading
var cb = function() {
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'css/main.min.css';
  var h = document.getElementsByTagName('head')[0];
  h.parentNode.insertBefore(l, h);
};
var raf = requestAnimationFrame || mozRequestAnimationFrame ||
  webkitRequestAnimationFrame || msRequestAnimationFrame;
if (raf) raf(cb);
else window.addEventListener('load', cb);

})(jQuery, window, document);
