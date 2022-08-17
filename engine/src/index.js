function start() {
    const sw = 24;
    const sh = 16;

    const display = new PixelDisplay(120, sw, sh);
    const frames = hmFS.stat_asset("frames.dat")[0].size / (sw * sh);

    const file = hmFS.open_asset("frames.dat", hmFS.O_RDONLY);

    let i = 0, arr = new Uint8Array(sw * sh);

    const t = timer.createTimer(0, 1000, () => {
      hmFS.read(file, arr.buffer, 0, sw * sh);
      display.render(arr);

      i++;
      if(i >= frames) {
        timer.stopTimer(t);
        hmApp.goBack();
      }
    })
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    hmSetting.setBrightScreen(300);

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 440,
      w: 192,
      h: 50,
      text: "by melianmiko",
      color: 0x222222,
      align_h: hmUI.align.CENTER_H
    })

    const t = timer.createTimer(250, 250, () => {
      timer.stopTimer(t);
      start();
    })
  },

  onDestroy() {
    hmSetting.setBrightScreenCancel()
  }
});
