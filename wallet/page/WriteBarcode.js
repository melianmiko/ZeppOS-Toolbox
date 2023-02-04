import { CardsStorage } from "../utils/CardsStorage";
import { JsBarcode } from "../../lib/3rd/JsBarcode/JsBarcode.js";
import { CanvasTGA } from "../../lib/CanvasTGA.js";
import { autoPrettifyBarcode } from "../utils/CanvasTools";
import { CardWriterUI } from "../utils/CardWriterUI";

class BarcodeWriter extends CardWriterUI {
  process(params) {
    const data = JSON.parse(params);

    let canvas = new CanvasTGA(1, 1);
    canvas.addPalette({
      "#ffffff": 0xffffff,
      "#000000": 0x0,
    });

    JsBarcode(canvas, data.content, {
      format: data.format,
      flat: data.format.startsWith("EAN"),
      height: 60,
      width: 2,
      displayValue: false,
    });

    canvas = autoPrettifyBarcode(canvas);

    const storage = new CardsStorage();
    this.result = storage.addCard(data, canvas);
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(params) {
    (new BarcodeWriter()).start(params)
  }
});
