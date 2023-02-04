import { CardsStorage } from "../utils/CardsStorage";
import {goBackGestureCallback, goBack} from "../../lib/bugWorkaround";

class CardViewScreen {
  constructor(params) {
    this.params = JSON.parse(params);
    this.editPaneVisible = false;
  }

  build() {
    this.lastBrightness = hmSetting.getBrightness();
    hmSetting.setBrightness(100);
    hmSetting.setBrightScreen(180);
    hmApp.registerGestureEvent((i) => this.gestureHandle(i));

    const x = (192 - this.params.width) / 2;
    const y = (490 - this.params.height) / 2;

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      color: 0xffffff,
    });
    hmUI.createWidget(hmUI.widget.IMG, {
      x,
      y,
      w: this.params.width,
      h: this.params.height,
      src: this.params.filename,
    });
  }

  gestureHandle(i) {
    if (i === hmApp.gesture.RIGHT && this.editPaneVisible) {
      this.hideEditPane();
      return true;
    } else if (i === hmApp.gesture.LEFT && !this.editPaneVisible) {
      this.showEditPane();
      return true;
    }

    return goBackGestureCallback(i);
  }

  showEditPane() {
    const buttonStyle = {
      x: 0,
      y: 105,
      w: 192,
      h: 64,
      color: 0x0,
      normal_color: 0xffffff,
      press_color: 0xf4f4f4,
      radius: 8,
    };

    this.editPane = [];
    this.editPaneVisible = true;

    this.editPane.push(
      hmUI.createWidget(hmUI.widget.FILL_RECT, {
        x: 0,
        y: 0,
        w: 192,
        h: 490,
        color: 0xeeeeee,
      })
    );

    this.editPane.push(
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...buttonStyle,
        color: 0xff0000,
        text: "Удалить",
        click_func: () => {
          const storage = new CardsStorage();
          storage.deleteCard(this.params);
          goBack();
        },
      })
    );
  }

  hideEditPane() {
    this.editPaneVisible = false;
    for (let w of this.editPane) hmUI.deleteWidget(w);
  }

  finish() {
    hmSetting.setBrightness(this.lastBrightness);
    hmSetting.setBrightScreenCancel();
    hmApp.unregisterGestureEvent();
  }
}

let current;
let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    current = new CardViewScreen(p);
    current.build();
  },
  onDestroy() {
    current.finish();
  },
});
