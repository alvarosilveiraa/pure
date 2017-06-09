let touch = new pure.Touch();
let navigation = new pure.Navigation({
  os: "android",
  root: "foo"
})
navigation.init();

function fooCtrl(page) {
  let refresher = new pure.Refresher({
    view: page
  });

  touch.init({
    element: page,
    onStart: function(e) {
      refresher.onTouchStart.call(refresher, e);
    },
    onMove: function(e) {
      refresher.onTouchMove.call(refresher, e);
    },
    onEnd: function(e) {
      refresher.onTouchEnd.call(refresher, e);
    }
  });
}
