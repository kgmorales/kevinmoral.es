$(function() {
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
