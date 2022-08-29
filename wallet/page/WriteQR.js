import { CardsStorage } from "../utils/CardsStorage";
import { CanvasTGA } from "../lib/CanvasTGA.js";
import { autoPrettifyBarcode } from "../utils/CanvasTools";
import { CardWriterUI } from "../utils/CardWriterUI";
import {qrcode} from "../lib/external/qrcode";

class QRWriter extends CardWriterUI {
  process(params) {
    const data = JSON.parse(params);

    const qr = qrcode(0, "L");
    qr.addData(data.content);
    qr.make();

    const count = qr.getModuleCount();
    const pixelSize = Math.floor(182 / count);

    let canvas = new CanvasTGA(count * pixelSize, count * pixelSize);
    qr.renderTo2dContext(canvas, pixelSize);

    canvas = autoPrettifyBarcode(canvas);

    const storage = new CardsStorage();
    this.result = storage.addCard(data, canvas);
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(params) {
    (new QRWriter()).start(params)
  }
});
