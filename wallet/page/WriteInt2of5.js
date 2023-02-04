import { CardsStorage } from "../utils/CardsStorage";
import { CanvasTGA } from "../../lib/CanvasTGA.js";
import { CardWriterUI } from "../utils/CardWriterUI";

const I2OF5_DATA = [
  "nnwwn",
  "wnnnw",
  "nwnnw",
  "wwnnn",
  "nnwnw",
  "wnwnn",
  "nwwnn",
  "nnnww",
  "wnnwn",
  "nwnwn"
];

function drawInt2of5(data, canvas) {
  if (data.length % 2) {
    data = "0" + data;
  }

  let dest = "1010", intEven, intOdd;
  for (let i = 0; i < data.length / 2; i++) {
    intEven = parseInt(data.substr(i * 2, 1), 10);
    intOdd = parseInt(data.substr(i * 2 + 1, 1), 10);
    for (var j = 0; j < 5; j++) {
      if (I2OF5_DATA[intEven].substr(j, 1) == "w") 
        dest += "11";
      dest += "1";
      if (I2OF5_DATA[intOdd].substr(j, 1) == "w") 
        dest += "00";
      dest += "0";
    }
  }
  dest += "11101";

  // Draw to canvas
  canvas.height = dest.length * 2;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);  
  ctx.fillStyle = "white";

  for(let i = 0; i < dest.length; i++) {
    if(dest[i] == "0") {
      ctx.fillRect(0, i * 2, canvas.width, 2);
    }
  }

  return dest;
}


class I2of5Writer extends CardWriterUI {
  process(params) {
    const data = JSON.parse(params);
    const canvas = new CanvasTGA(100, 1);
    drawInt2of5(data.content, canvas);

    const storage = new CardsStorage();
    this.result = storage.addCard(data, canvas);
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(params) {
    (new I2of5Writer()).start(params)
  }
});
