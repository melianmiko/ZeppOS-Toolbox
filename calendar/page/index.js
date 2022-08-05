(() => {
  class FsUtils {
    static fetchTextFile(fn) {
      const st = hmFS.stat_asset(fn)[0];
      const f = hmFS.open_asset(fn, hmFS.O_RDONLY);
      const data = new ArrayBuffer(st.size);
      hmFS.read(f, data, 0, st.size);
      hmFS.close(f);

      const view = new Uint8Array(data);
      let str = "";

      return FsUtils.Utf8ArrayToStr(view);
    }

    static fetchJSON(fn) {
      return JSON.parse(FsUtils.fetchTextFile(fn));
    }

    // source: https://stackoverflow.com/questions/13356493/decode-utf-8-with-javascript
    static Utf8ArrayToStr(array) {
      var out, i, len, c;
      var char2, char3;

      out = "";
      len = array.length;
      i = 0;
      while (i < len) {
        c = array[i++];
        switch (c >> 4) {
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
          case 7:
            // 0xxxxxxx
            out += String.fromCharCode(c);
            break;
          case 12:
          case 13:
            // 110x xxxx   10xx xxxx
            char2 = array[i++];
            out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
            break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            char2 = array[i++];
            char3 = array[i++];
            out += String.fromCharCode(
              ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
            );
            break;
        }
      }

      return out;
    }
  }

  class AppCalendar {
    columns = [];

    /**
     * Fetch all required data
     */
    constructor() {
      const time = hmSensor.createSensor(hmSensor.id.TIME);

      this._data = FsUtils.fetchJSON("highlights.json");

      this.today = time.year + "-" + 
        String(time.month).padStart(2, "0") + "-" + 
        String(time.day).padStart(2, "0");

      this.currentMonth = time.month;
      this.currentYear = time.year;
    }

    /**
     * Render base UI
     */
    start() {
      this.todayHighlight = hmUI.createWidget(hmUI.widget.FILL_RECT, {
        w: 26,
        h: 20,
        color: 0xaa2222,
        x: -20,
        y: -20,
        radius: 4
      })

      this.display = hmUI.createWidget(hmUI.widget.TEXT, {
        x: 0,
        y: 32,
        w: 192,
        color: 0xffffff,
        text_size: 24,
        text: "Hello",
        align_h: hmUI.align.CENTER_H,
      });

      for (let i = 0; i < 7; i++) {
        this.columns.push(
          hmUI.createWidget(hmUI.widget.TEXT, {
            x: 5 + 26 * i,
            y: 108,
            w: 26,
            h: 180,
            color: 0xffffff,
            text_size: 16,
            alpha: i > 4 ? 160 : 255,
            align_h: hmUI.align.CENTER_H,
            text: "0\n1\n2",
          })
        );
      }

      this.highlights = hmUI.createWidget(hmUI.widget.TEXT, {
        x: 12,
        y: 288,
        w: 168,
        h: 0,
        text_size: 18,
        text_style: hmUI.text_style.WRAP,
        alpha: 200,
        color: 0xffffff,
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
        if (date.getMonth() === this.currentMonth - 1) {
          columns[(date.getDay() + 6) % 7] += date.getDate();

          const hl = date.getDate() + "." + this.currentMonth;
          if (this._data[hl]) {
            highlights += hl + ": " + this._data[hl] + "\n";
          }
        }

        // Find column, append value
        const column = (date.getDay() + 6) % 7;
        columns[column] += "\n";

        // Today highlight
        console.log(this.today, date.toISOString().substring(0,10))
        if(date.toISOString().substring(0, 10) == this.today) {
          const columnLines = columns[column].split("\n");

          todayX = 5 + 26*(column-1);
          todayY = 110 + 24 * (columnLines.length-2);
        }

        // Next day
        date.setDate(date.getDate() + 1);
      }

      // Update columns
      for (let i = 0; i < columns.length; i++) {
        this.columns[i].setProperty(hmUI.prop.TEXT, columns[i]);
      }

      // Update today highlight
      console.log(todayX, todayY)
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
      const cal = new AppCalendar();
      cal.start();
    },
  });
})();
