(() => {
  class ElIM02TopScore {
    static colorVariants = [
      0xc8ffdb, 0x6da175, 0xc4b984, 0xc484a2, 0xbbbbbb, 0xfbffd9,
    ];

    fetch() {
      const current = [];
      for (let i = 0; i < 5; i++) {
        current[i] = hmFS.SysProGetInt("el02_top" + i);
        if (!current[i]) current[i] = i == 4 ? 0 : (4 - i) * 100;
      }
      return current;
    }

    addResult(v) {
      const current = this.fetch();

      if (v > current[4]) current[4] = v;
      current.sort();
      current.reverse();

      for (let i = 0; i < 5; i++) {
        hmFS.SysProSetInt("el02_top" + i, current[i]);
      }
    }

    start() {
      let current = this.fetch();

      let currentBgColor = hmFS.SysProGetInt("im02_bg");
      if (!currentBgColor) currentBgColor = 0;
      let color = ElIM02TopScore.colorVariants[currentBgColor];

      let bg = hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: 192,
        h: 490,
        color,
      });

      hmUI.createWidget(hmUI.widget.IMG, {
        x: 49,
        y: 30,
        src: "title_top.png",
      });

      const base = {
        font_array: [...Array(10).keys()].map((i) => `font/${i}.png`)
      };

      // TOP
      for (let i = 0; i < 5; i++) {
        hmUI.createWidget(hmUI.widget.TEXT_IMG, {
          x: 30,
          y: 100 + i * 30,
          text: (i + 1).toString(),
          ...base,
        });
        hmUI.createWidget(hmUI.widget.TEXT_IMG, {
          x: 100,
          y: 100 + i * 30,
          text: current[i].toString(),
          ...base,
        });
      }

      // Play btn
      hmUI.createWidget(hmUI.widget.IMG, {
        x: 0,
        y: 250,
        pos_x: 72,
        pos_y: 30,
        w: 192,
        h: 100,
        src: "play.png",
      }).addEventListener(hmUI.event.CLICK_UP, () => {
        hmApp.gotoPage({ url: "page/game", param: color });
      });

      hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: 350,
        w: 192,
        h: 50,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text: "Изменить фон",
        color: 0x0,
        alpha: 192,
      }).addEventListener(hmUI.event.CLICK_UP, () => {
        let current = hmFS.SysProGetInt("im02_bg");
        if (!current) current = 0;
        current = (current + 1) % ElIM02TopScore.colorVariants.length;
        color = ElIM02TopScore.colorVariants[current];

        hmFS.SysProSetInt("im02_bg", current);
        bg.setProperty(hmUI.prop.MORE, { color });
      });

      // Copyright
      hmUI.createWidget(hmUI.widget.IMG, {
        x: 29,
        y: 420,
        alpha: 80,
        src: "copyright_do_not_remove.png",
      });
    }
  }

  let __$$app$$__ = __$$hmAppManager$$__.currentApp;
  let __$$module$$__ = __$$app$$__.current;
  __$$module$$__.module = DeviceRuntimeCore.Page({
    onInit() {
      hmSetting.setBrightScreen(30);
      hmUI.setLayerScrolling(false);
      
      new ElIM02TopScore().start();
    },
    onDestroy() {
      hmSetting.setBrightScreenCancel();
    }
  });
})();
