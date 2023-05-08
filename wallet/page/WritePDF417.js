import { CardsStorage } from "../utils/CardsStorage";
import { CanvasTGA } from "../../lib/CanvasTGA.js";
import { autoPrettifyBarcode } from "../utils/CanvasTools";
import { CardWriterUI } from "../utils/CardWriterUI";
import { PDF417 } from "../../lib/3rd/pdf417.js";

class PdfWriter extends CardWriterUI {
  process(params) {
    const data = JSON.parse(params);

    PDF417.init(data.content);
    const { num_cols, num_rows, bcode } = PDF417.getBarcodeArray();
    
    let canvas = new CanvasTGA(num_cols * 3, num_rows * 2);
    canvas.fillStyle = "black";
    for (let i = 0; i < num_rows; i++) {
      for (let j = 0; j < num_cols; j++) {
        if (bcode[i][j] == 1) canvas.fillRect(3 * j, 2 * i, 3, 2);
      }
    }

    canvas = autoPrettifyBarcode(canvas);

    const storage = new CardsStorage();
    this.result = storage.addCard(data, canvas);
  }
}

Page({
  onInit(params) {
    new PdfWriter().start(params);
  },
});
