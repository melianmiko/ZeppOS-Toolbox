export function goBack() {
  hmApp.setLayerY(0);
  hmUI.createWidget(hmUI.widget.FILL_RECT, {
    x: 0,
    y: 0,
    w: 192,
    h: 490,
    color: 0x0
  });
  timer.createTimer(350, 0, () => hmApp.goBack());
}

export function goBackGestureCallback(ev) {
  if(ev === hmApp.gesture.RIGHT) {
  	goBack();
    return true;
  }

  return false;
}
