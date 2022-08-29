import {JsBarcode} from "../lib/JsBarcode/JsBarcode.js"
import {CanvasTGA} from "../lib/CanvasTGA.js";

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    const canvas = new CanvasTGA(192, 490);
    canvas.addPalette({
      "#ffffff": 0xFFFFFF,
      "#000000": 0x0
    })

    JsBarcode(canvas, "hello", {
      format: "code39"
    });

    CanvasTGA.rotate90(canvas).saveAsset("1.png");

    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      color: 0xffffff
    })
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 30,
      y: 96,
      src: "1.png"
    })
  }
});
