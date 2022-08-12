(() => {
  let vibrate = null;

  let __$$app$$__ = __$$hmAppManager$$__.currentApp;
  let __$$module$$__ = __$$app$$__.current;
  __$$module$$__.module = DeviceRuntimeCore.Page({
    build() {
      hmSetting.setBrightScreen(180);

      // Bell icon
      let counter = 0;
      let icon = hmUI.createWidget(hmUI.widget.IMG, {
        x: 0,
        y: 120,
        w: 192,
        h: 64,
        pos_x: (192-64)/2,
        pos_y: 0,
        center_x: 192/2,
        center_y: 0,
        src: "bell.p.png"
      });
      timer.createTimer(0, 500, () => {
        icon.setProperty(hmUI.prop.MORE, {
          angle: count % 2 == 0 ? -15 : 15
        });
        counter++;

        // Auto-exit after 0.5m
        if(counter === 60) 
          hmApp.goBack();
      });

      // Exit button
      hmUI.createWidget(hmUI.widget.IMG, {
        x: (192-72)/2,
        y: 300,
        src: "bell_stop.png"
      }).addEventListener(hmUI.event.CLICK_UP, () => {
        hmApp.goBack();
      });

      // Vibro
      vibrate = hmSensor.createSensor(hmSensor.id.VIBRATE);
      vibrate.scene = 1;
      vibrate.start();

      // Wipe
      hmFS.SysProSetChars("mmk_tb_timer_state", "");
    },
    onDestroy: () => {
      vibrate.stop();
      hmSetting.setBrightScreenCancel();
    }
  })
})();