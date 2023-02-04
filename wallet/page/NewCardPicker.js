import {TouchEventManager} from "../../lib/TouchEventManager";
import {ScreenBoard} from "../../lib/ScreenBoard";
import {CardsStorage} from "../utils/CardsStorage";
import {CardTypes} from "../utils/database";
import {goBackGestureCallback} from "../../lib/bugWorkaround";

class SubScreen {
  widgets = [];

  constructor() {
    hmApp.setLayerY(0);
  }

  createWidget(a, b) {
    const w = hmUI.createWidget(a, b);
    this.widgets.push(w);
    return w;
  }

  close() {
    for(const w of this.widgets) hmUI.deleteWidget(w);
      this.widgets = [];
  }
}


class IconsSubscreen extends SubScreen {
  build() {
    this.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 56,
      w: 192,
      h: 24,
      align_h: hmUI.align.CENTER_H,
      text: "Новая карта",
      color: 0xffffff,
    })

    let y = 96, i = 0;
    for(const ID in CardTypes) {
      this.drawCardButton(ID, 100 * (i % 2), y);
      if(i % 2 == 1) y += 77;
      i++;
    }

    this.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: 96 + 77 * Math.ceil(Object.keys(CardTypes).length / 2),
      w: 192,
      h: 96,
      text: "Вручную",
      color: 0xAAAAAA,
      click_func: () => {
        hmApp.reloadPage({
          url: "page/AdvEditor"
        })
      }
    })
  }

  drawCardButton(id, x, y) {
    const b = this.createWidget(hmUI.widget.IMG, {
      x, y,
      src: `cards/${id}.png`
    });

    const events = new TouchEventManager(b);
    events.ontouch = () => {
      this.onItemClick(id);
    };
  }

  onItemClick(id) {
    if(CardTypes[id].info) {
      this.close();
      hmApp.setLayerY(0);
      this.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: 0,
        w: 192,
        h: 490,
        align_h: hmUI.align.CENTER_H,
        align_v: hmUI.align.CENTER_V,
        text_style: hmUI.text_style.WRAP,
        text_size: 20,
        color: 0xFFFFFF,
        text: CardTypes[id].info + "\n\nКоснитесь, чтобы продолжить"
      }).addEventListener(hmUI.event.CLICK_UP, () => {
        this.nextScreen(id);
      })

      return;
    }

    this.nextScreen(id);
  }

  nextScreen(id) {
      this.close();
      (new KeyboardSubscreen(id)).build();
  }
}


class KeyboardSubscreen extends SubScreen {
  constructor(id) {
    super();

    this.dataID = id;
    this.data = CardTypes[id];
  }

  build() {
    const type = this.data.keyboard;

    this.board = new ScreenBoard(type, 162);
    this.board.title = "Введите\nномер с карты";
    this.board.confirmButtonText = "Создать";
    this.board.onConfirm = (v) => this.process(v);

    if(this.data.displayFormat)
      this.board.displayFormat = this.data.displayFormat;
  }

  process(value) {
    let format = this.data.format;

    if(this.data.inputValidate) {
      const result = this.data.inputValidate(value);
      if(!result) return hmUI.showToast({
        text: "Некорректный код"
      })
    }

    if(this.data.codePostProcessing) {
      value = this.data.codePostProcessing(value);
    }

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      color: 0x0
    });

    const t = timer.createTimer(0, 500, () => {
      timer.stopTimer(t);

      CardsStorage.startWrite({
        icon: this.dataID, 
        content: value,
        format
      });
    })
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    hmSetting.setBrightScreen(600);
    hmApp.registerGestureEvent(goBackGestureCallback);
    (new IconsSubscreen()).build();
  },
  onDestroy() {
    hmApp.unregisterGestureEvent();
  }
});
