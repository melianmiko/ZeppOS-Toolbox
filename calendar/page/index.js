import { AppGesture } from "../../lib/AppGesture";
import {FsUtils} from "../../lib/FsUtils";

class AppCalendar {
  columns = [];

  /**
   * Fetch all required data
   */
  constructor() {
    const time = hmSensor.createSensor(hmSensor.id.TIME);

    this._data = FsUtils.fetchJSON("highlights.json");

    this.today = time.year + "-" + 
      String(time.month) + "-" + 
      String(time.day);

    this.currentMonth = time.month;
    this.currentYear = time.year;
  }

  /**
   * Render base UI
   */
  start() {
    this.todayHighlight = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
      w: 26,
      h: 20,
      color: 0xff2222,
      line_width: 2,
      x: -20,
      y: -20,
      radius: 4
    })

    this.display = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 40,
      w: 192,
      h: 50,
      color: 0xffffff,
      text_size: 24,
      text: "Hello",
      align_h: hmUI.align.CENTER_H,
    });

    this.display.addEventListener(hmUI.event.CLICK_UP, () => {
      const time = hmSensor.createSensor(hmSensor.id.TIME);
      this.currentYear = time.year;
      this.currentMonth = time.month;
      this.laodContent();
    });

    for (let i = 0; i < 7; i++) {
      this.columns.push(
        hmUI.createWidget(hmUI.widget.TEXT, {
          x: 5 + 26 * i,
          y: 108,
          w: 26,
          h: 180,
          color: i > 4 ? 0xffaaaa : 0xffffff,
          text_size: 16,
          align_h: hmUI.align.CENTER_H,
          text: "0\n1\n2",
        })
      );
    }

    this.highlights = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: 288,
      w: 192,
      h: 0,
      text_size: 18,
      text_style: hmUI.text_style.WRAP,
      color: 0xeeeeee,
      text: "..."
    });

    this.laodContent();

    hmUI.createWidget(hmUI.widget.IMG, {
      x: 0,
      y: 100,
      w: 96,
      h: 260 - 72,
      src: "",
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      this.switchPage(-1);
    });

    hmUI.createWidget(hmUI.widget.IMG, {
      x: 96,
      y: 100,
      w: 96,
      h: 260 - 72,
      src: "",
    }).addEventListener(hmUI.event.CLICK_UP, () => {
      this.switchPage(1);
    });
  }

  /**
   * Change page
   */
  switchPage(delta) {
    this.currentMonth += delta;
    if (this.currentMonth < 1) {
      this.currentYear--;
      this.currentMonth = 12;
    } else if (this.currentMonth > 12) {
      this.currentYear++;
      this.currentMonth = 1;
    }
    this.laodContent();
  }

  /**
   * Load page content
   */
  laodContent() {
    this.display.setProperty(
      hmUI.prop.TEXT,
      this.currentYear + "-" + this.currentMonth
    );

    // Start/finish date
    const date = new Date(this.currentYear, this.currentMonth - 1);
    const end = new Date(this.currentYear, this.currentMonth);

    // Prepare columns array
    const columns = ["ПН\n", "ВТ\n", "СР\n", "ЧТ\n", "ПТ\n", "СБ\n", "ВС\n"];
    const voids = (date.getDay() + 6) % 7;
    for (let i = 0; i < voids; i++) columns[i] += "\n";

    // Iterate days from date to end
    let highlights = "", todayX = -20, todayY = -20;
    while (date < end) {
      const column = (date.getDay() + 6) % 7;

      if (date.getMonth() === this.currentMonth - 1) {
        columns[column] += date.getDate();

        const hl = date.getDate() + "." + this.currentMonth;
        if (this._data[hl]) {
          highlights += hl + ": " + this._data[hl] + "\n";
        }
      }

      // Find column, append value
      columns[column] += "\n";

      // Today highlight
      const str = date.getFullYear() + "-" + 
        (date.getMonth()+1) + "-" + date.getDate();

      if(str == this.today) {
        const columnLines = columns[column].split("\n");

        todayX = 5 + 26*(column);
        todayY = 111 + 24 * (columnLines.length-2);
      }

      // Next day
      date.setDate(date.getDate() + 1);
    }

    // Update columns
    for (let i = 0; i < columns.length; i++) {
      this.columns[i].setProperty(hmUI.prop.TEXT, columns[i]);
    }

    // Update today highlight
    this.todayHighlight.setProperty(hmUI.prop.MORE, {
      x: todayX,
      y: todayY
    })

    // Update highlights
    if (!highlights) highlights = "Нет информации";
    const metrics = hmUI.getTextLayout(highlights, {
      text_size: 18,
      text_width: 168
    });
    this.highlights.setProperty(hmUI.prop.TEXT, highlights);
    this.highlights.setProperty(hmUI.prop.MORE, {
      h: metrics.height + 80
    })
  }
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit() {
    AppGesture.on("left", () => {
      hmApp.gotoPage({
        url: "page/AboutScreen",
      });
    });
    AppGesture.init();

    const cal = new AppCalendar();
    cal.start();
  },
});
