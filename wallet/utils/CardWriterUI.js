export class CardWriterUI {
  start(params) {
    const allowed = hmFS.SysProGetBool("mmk_c_aw");
    if(!allowed) return hmApp.goBack();

    hmSetting.setBrightScreen(60);
    this.viewText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 240,
      w: 192,
      h: 24,
      align_h: hmUI.align.CENTER_H,
      color: 0xaaaaaa,
      text: "Обработка...",
    });

    const t = timer.createTimer(0, 1000, () => {
      timer.stopTimer(t);
      try {
        this.process(params);
      } catch(e) {
        console.log(e);
        hmUI.showToast({text: "Что-то пошло не так"});
      }
      this.finish();
    });
  }

  finish() {
    const out = this.result;

    hmUI.deleteWidget(this.viewText);
    hmFS.SysProSetBool("mmk_c_aw", false);

    const t = timer.createTimer(0, 500, () => {
      timer.stopTimer(t);
      hmApp.gotoPage({
        url: "page/CardView",
        param: `${out.filename},${out.width},${out.height}`,
      });
    });
  }
}
