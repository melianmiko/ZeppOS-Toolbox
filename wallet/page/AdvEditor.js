import {ScreenBoard} from "../utils/ScreenBoard";
import {TouchEventManager} from "../lib/TouchEventManager";
import {CardsStorage} from "../utils/CardsStorage";

const FORMATS = [
  "QR",
  "PDF417",
  "CODE128",
  "CODE39",
  "EAN13",
  "EAN8",
  "EAN5",
  "UPC",
  "ITF14",
  "codabar"
]

class AdvEditorScreen {
  y = 96;
  data = {
    format: "QR",
    icon: "",
    title: "Card",
    color: "0099FF",
    content: "123"
  };

  start() {
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: 192,
      h: 490,
      color: 0x0
    })

    // Fields
    this.addTextField("title", "Название");
    this.addSelectField("format", "Формат", FORMATS);
    this.addTextField("color", "Цвет (HEX)");
    this.addTextField("content", "Данные");

    // Finish button
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 0,
      y: 420,
      w: 192,
      h: 70,
      text: "Создать",
      color: 0xFFFFFF,
      normal_color: 0x111111,
      press_color: 0x222222,
      click_func: () => this.create()
    })

    // Init ScreenBoard
    this.board = new ScreenBoard(["EN", "RU", "123"]);
    this.board.confirmButtonText = "Готово";
    this.board.visible = false;
  }

  create() {
    this.data.color = eval("0x" + this.data.color);
    CardsStorage.startWrite(this.data);
  }

  addSelectField(key, title, options) {
    const viewValue = this._mkBasement(key, title);

    // Click handler
    const btn = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: this.y,
      w: 192,
      h: 64
    });
    const eBtn = new TouchEventManager(btn);
    eBtn.ontouch = () => {
      const cur = options.indexOf(this.data[key]);
      const next = (cur + 1) % options.length;
      this.data[key] = options[next];
      viewValue.setProperty(hmUI.prop.TEXT, options[next]);
    };

    this.y += 72;
  }

  addTextField(key, title) {
    const viewValue = this._mkBasement(key, title);

    // Click handler
    const btn = hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: this.y,
      w: 192,
      h: 64
    });
    const eBtn = new TouchEventManager(btn);
    eBtn.ontouch = () => {
      // Reconfigure ScreenBoard
      this.board.visible = true;
      this.board.title = title
      this.board.value = this.data[key];
      this.board.onConfirm = (v) => {
        this.data[key] = v;
        viewValue.setProperty(hmUI.prop.TEXT, v);
        this.board.visible = false;
      };
    };

    this.y += 72;
  }

  _mkBasement(key, title) {
    hmUI.createWidget(hmUI.widget.FILL_RECT, {
      x: 0,
      y: this.y,
      w: 192,
      h: 64,
      color: 0x111111,
      radius: 8
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 4,
      y: this.y + 4,
      w: 184,
      h: 24,
      color: 0x999999,
      text: title
    });

    const viewValue = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 4,
      y: this.y + 28,
      w: 184,
      h: 32,
      color: 0xFFFFFF,
      text_size: 24,
      text: this.data[key]
    });

    return viewValue;
  }
}


let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    hmSetting.setBrightScreen(600);
    (new AdvEditorScreen()).start();
  }
});
