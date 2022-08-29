let lastBrightness = 0;

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    lastBrightness = hmSetting.getBrightness();
    hmSetting.setBrightness(100);
    hmSetting.setBrightScreen(180);

    let [fn, w, h] = p.split(",");
    w = parseInt(w);
    h = parseInt(h);

    const x = (192 - w) / 2;
    const y = (490 - h) / 2;

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      color: 0xffffff
    });

    hmUI.createWidget(hmUI.widget.IMG, {
      x, y, w, h,
      src: fn
    })
  },
  
  onDestroy() {
    hmSetting.setBrightness(lastBrightness);
    hmSetting.setBrightScreenCancel();
    hmApp.unregisterGestureEvent();
  }
});
