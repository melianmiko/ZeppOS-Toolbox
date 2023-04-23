import { AppGesture } from "../../lib/AppGesture";

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 93464,
      url: "page/DonateCode",
    });
    AppGesture.init();

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      color: 0xFFFFFF
    });
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: (490-192)/2,
      src: "qr_donate.png"
    });
  }
});
