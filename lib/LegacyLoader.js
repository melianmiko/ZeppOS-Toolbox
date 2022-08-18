class LegacyLoader {
  offsetX = 20;
  offsetY = 2;
  jsonData = {};
  updateHandlers = [];

  withBackgroundAtAOD = false;

  constructor(path, jsonData) {
    this.path = path;
    this.jsonData = jsonData;
  }

  createWidget() {
    if(typeof Tk !== "undefined")
      return Tk.createWidget(...arguments);
    return hmUI.createWidget(...arguments);
  }

  createTimer() {
    if(typeof Tk !== "undefined")
      return Tk.createTimer(...arguments);
    return timer.createTimer(...arguments);
  }

  createTextImg(config) {
    if(!config.v_space) 
      return this.createWidget(hmUI.widget.TEXT_IMG, config);

    const imgs = [];

    // Prebuild
    for(let i = 0; i < 5; i++) {
      imgs[i] = this.createWidget(hmUI.widget.IMG, {
        x: config.x + (config.h_space + config.img_w) * i,
        y: config.y + (config.v_space) * i,
        show_level: config.show_level,
        src: ""
      })
    }

    const setText = (val) => {
      for(let i = 0; i < 5; i++) {
        let liter = ""

        if(i < val.length) {
          liter = config.font_array[val[i]];
          if(val[i] == ".") liter = config.dot_image;
        }

        imgs[i].setProperty(hmUI.prop.MORE, {src: liter});
      }
    };

    setText(config.text);

    return {
      setProperty(_, text) {
        setText(text);
      }
    }
  }

  getObject(path, callback) {
    const levels = path.split(".");
    let position = this.jsonData;

    for(let i = 0; i < levels.length; i++) {
      if(position[levels[i]] === undefined) return null;

      position = position[levels[i]];
    }

    if(callback) callback(position);
    return position;
  }

  getFileFromID(id) {
    if(typeof id !== "number") return undefined;
    return this.path + id.toString().padStart(4, "0") + ".png";
  }

  mkFontArrayFrom(id, length) {
    const out = [];
    for(let i = id; i < id + length; i++)
      out.push(this.getFileFromID(i));
    return out;
  }

  convertAlignProps(obj) {
    let alignY;
    if(obj.Alignment.indexOf("Bottom") > -1)
      alignY = hmUI.align.BOTTOM;
    else if(obj.Alignment.indexOf("Center") == 0)
      alignY = hmUI.align.CENTER_V;
    else
      alignY = hmUI.align.TOP;

    let alignX;
    if(obj.Alignment.indexOf("Right") > -1)
      alignX = hmUI.align.RIGHT;
    else if(obj.Alignment.lastIndexOf("Center") > 0 || obj.Alignment == "Center")
      alignX = hmUI.align.CENTER_H;
    else
      alignX = hmUI.align.LEFT

    const w = obj.BottomRightX - obj.TopLeftX;
    const h = obj.BottomRightY - obj.TopLeftY;

    return {
        x: this.offsetX + obj.TopLeftX,
        y: this.offsetY + obj.TopLeftY,
        w: w > 3 ? w : undefined,
        h: h > 3 ? h : undefined,
        align_h: alignX,
        align_v: alignY,
        img_w: obj.ImageWidth,
        img_h: obj.ImageHeight
    }
  }

  getWeatherIcons(index) {
    const out = [];
    for(let i = 0; i < 23; i++) {
      out.push(this.getFileFromID(index + i + 1));
    }

    while(out.length < 29) {
      out.push(this.getFileFromID(index));
    }

    return out;
  }

  render() {
    const time = hmSensor.createSensor(hmSensor.id.TIME);
    const weather = hmSensor.createSensor(hmSensor.id.WEATHER);
    const updateHandlers = [];

    // BG
    this.getObject("Background.BackgroundColor", (val) => {
      this.createWidget(hmUI.widget.FILL_RECT, {
        x: 0, y: 0, w: 192, h : 490,
        color: eval(val),
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    })
    this.getObject("Background.Image", (image) => {
      this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + image.X, 
        y: this.offsetY + image.Y,
        src: this.getFileFromID(image.ImageIndex),
        show_level: this.withBackgroundAtAOD ? undefined : hmUI.show_level.ONLY_NORMAL
      })
    })

    // Time
    this.getObject("Time.Hours", (hours) => {
      const tensFont = this.mkFontArrayFrom(hours.Tens.ImageIndex, hours.Tens.ImagesCount);
      const onesFont = this.mkFontArrayFrom(hours.Ones.ImageIndex, hours.Ones.ImagesCount);

      const tens = this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + hours.Tens.X, 
        y: this.offsetY + hours.Tens.Y,
        src: ""
      });
      const ones = this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + hours.Ones.X, 
        y: this.offsetY + hours.Ones.Y,
        src: ""
      });

      updateHandlers.push(() => {
        tens.setProperty(hmUI.prop.MORE, {
          src: tensFont[Math.floor(time.hour / 10)]
        });
        ones.setProperty(hmUI.prop.MORE, {
          src: onesFont[time.hour % 10]
        });
      });
    });
    this.getObject("Time.Minutes", (minutes) => {
      const tensFont = this.mkFontArrayFrom(minutes.Tens.ImageIndex, minutes.Tens.ImagesCount);
      const onesFont = this.mkFontArrayFrom(minutes.Ones.ImageIndex, minutes.Ones.ImagesCount);

      const tens = this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + minutes.Tens.X, 
        y: this.offsetY + minutes.Tens.Y,
        src: ""
      });
      const ones = this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + minutes.Ones.X,
        y: this.offsetY + minutes.Ones.Y,
        src: ""
      });

      updateHandlers.push(() => {
        tens.setProperty(hmUI.prop.MORE, {
          src: tensFont[Math.floor(time.minute / 10)]
        });
        ones.setProperty(hmUI.prop.MORE, {
          src: onesFont[time.minute % 10]
        });
      });
    });
    this.getObject("Time.Seconds", (seconds) => {
      const tensFont = this.mkFontArrayFrom(seconds.Tens.ImageIndex, seconds.Tens.ImagesCount);
      const onesFont = this.mkFontArrayFrom(seconds.Ones.ImageIndex, seconds.Ones.ImagesCount);

      const tens = this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + seconds.Tens.X, 
        y: this.offsetY + seconds.Tens.Y,
        src: ""
      });
      const ones = this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + seconds.Ones.X,
        y: this.offsetY + seconds.Ones.Y,
        src: ""
      });

      updateHandlers.push(() => {
        tens.setProperty(hmUI.prop.MORE, {
          src: tensFont[Math.floor(time.second / 10)]
        });
        ones.setProperty(hmUI.prop.MORE, {
          src: onesFont[time.second % 10]
        });
      });
    });
    this.getObject("Time.DelimiterImage", (img) => {
      this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + img.X,
        y: this.offsetY + img.Y,
        src: this.getFileFromID(img.ImageIndex)
      })
    });
    this.getObject("Time.TimeZone2", (obj) => {
      const view = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.SUN_RISE,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        dot_image: this.getFileFromID(this.getObject("Time.TimeZone1DelimiterImage")),
        ...this.convertAlignProps(obj)
      });
    })
    this.getObject("Time.TimeZone1", (obj) => {
      const view = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.SUN_SET,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        dot_image: this.getFileFromID(this.getObject("Time.TimeZone1DelimiterImage")),
        ...this.convertAlignProps(obj)
      });
    })


    // Activity
    this.getObject("Activity.Steps.Number", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.STEP,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        icon: this.getFileFromID(this.getObject("Activity.Steps.PrefixImageIndex")),
        ...this.convertAlignProps(obj)
      })
    });
    this.getObject("Activity.PAI.Number", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.PAI_DAILY,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        icon: this.getFileFromID(this.getObject("Activity.PAI.PrefixImageIndex")),
        ...this.convertAlignProps(obj)
      })
    });
    this.getObject("Activity.Calories.Text", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.CAL,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        unit_en: this.getFileFromID(this.getObject("Activity.Calories.SuffixImageIndex")),
        icon: this.getFileFromID(this.getObject("Activity.Calories.PrefixImageIndex")),
        ...this.convertAlignProps(obj)
      })
    });
    this.getObject("Activity.Pulse.Number", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.HEART,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        icon: this.getFileFromID(this.getObject("Activity.Pulse.PrefixImageIndex")),
        invalid_img: this.getFileFromID(this.getObject("Activity.Pulse.NoDataImageIndex")),
        ...this.convertAlignProps(obj)
      })
    });
    this.getObject("Activity.Distance.Number", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.DISTANCE,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        unit_en: this.getFileFromID(this.getObject("Activity.Distance.KmSuffixImageIndex")),
        dot_image: this.getFileFromID(this.getObject("Activity.Distance.DecimalPointImageIndex")),
        ...this.convertAlignProps(obj)
      })
    });

    // Date
    this.getObject("Date.MonthAndDayAndYear.OneLine", (date) => {
      const twoDigitsMonth = this.getObject("Date.MonthAndDayAndYear.TwoDigitsMonth");
      const twoDigitsDay = this.getObject("Date.MonthAndDayAndYear.TwoDigitsDay");

      const view = this.createWidget(hmUI.widget.TEXT_IMG, {
        text: "0",
        h_space: date.Number.SpacingX,
        dot_image: this.getFileFromID(date.DelimiterImageIndex),
        font_array: this.mkFontArrayFrom(date.Number.ImageIndex, date.Number.ImagesCount),
        ...this.convertAlignProps(date.Number),
      });
      updateHandlers.push(() => {
        let day = time.day.toString();
        if(twoDigitsDay) day = day.padStart(2, "0");
        let month = time.month.toString();
        if(twoDigitsMonth) month = month.padStart(2, "0");

        view.setProperty(hmUI.prop.TEXT, day + "." + month);
      })
    })
    this.getObject("Date.MonthAndDayAndYear.Separate.MonthsEN", (month) => {
      hmUI.createWidget(hmUI.widget.IMG_DATE, {
        month_en_array: this.mkFontArrayFrom(month.ImageIndex, month.ImagesCount),
        month_is_character: true,
        month_startX: this.offsetX + month.X,
        month_startY: this.offsetY + month.Y
      })
    });
    this.getObject("Date.MonthAndDayAndYear.Separate.Month", (date) => {
      const twoDigits = this.getObject("Date.MonthAndDayAndYear.TwoDigitsMonth");
      const view = this.createTextImg({
        text: "0",
        h_space: date.SpacingX,
        v_space: date.SpacingY,
        font_array: this.mkFontArrayFrom(date.ImageIndex, date.ImagesCount),
        ...this.convertAlignProps(date)
      });
      updateHandlers.push(() => {
        let val = time.month.toString();
        if(twoDigits) val = val.padStart(2, "0");
        view.setProperty(hmUI.prop.TEXT, val);
      })
    })
    this.getObject("Date.MonthAndDayAndYear.Separate.Day", (date) => {
      const twoDigits = this.getObject("Date.MonthAndDayAndYear.TwoDigitsDay");
      const view = this.createTextImg({
        text: "0",
        h_space: date.SpacingX,
        v_space: date.SpacingY,
        font_array: this.mkFontArrayFrom(date.ImageIndex, date.ImagesCount),
        ...this.convertAlignProps(date),
      });
      updateHandlers.push(() => {
        let val = time.day.toString();
        if(twoDigits) val = val.padStart(2, "0");
        view.setProperty(hmUI.prop.TEXT, val);
      })
    });

    // Weekday
    this.getObject("Date.ENWeekDays", (wd) => {
      this.createWidget(hmUI.widget.IMG_WEEK, {
        x: this.offsetX + wd.X,
        y: this.offsetY + wd.Y,
        week_en: this.mkFontArrayFrom(wd.ImageIndex, wd.ImagesCount)
      })
    })

    // Steps progress
    this.getObject("StepsProgress.LineScale", (scale) => {
      this.createWidget(hmUI.widget.IMG_LEVEL, {
        x: this.offsetX + scale.X,
        y: this.offsetY + scale.Y,
        type: hmUI.data_type.STEP,
        image_array: this.mkFontArrayFrom(scale.ImageIndex, scale.ImagesCount),
        image_length: scale.ImagesCount,
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    });
    this.getObject("HeartProgress.LineScale", (scale) => {
      this.createWidget(hmUI.widget.IMG_LEVEL, {
        x: this.offsetX + scale.X,
        y: this.offsetY + scale.Y,
        type: hmUI.data_type.HEART,
        image_array: this.mkFontArrayFrom(scale.ImageIndex, scale.ImagesCount),
        image_length: scale.ImagesCount,
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    });
    this.getObject("HeartProgress.Linear", (obj) => {
      const x = [], y = [], image_array = [];
      const startID = obj.StartImageIndex;

      for(let i = 0; i < obj.Segments.length; i++) {
        x.push(obj.Segments[i].X + this.offsetX);
        y.push(obj.Segments[i].Y + this.offsetY);
        image_array.push(this.getFileFromID(startID + i));
      }

      this.createWidget(hmUI.widget.IMG_PROGRESS, {
        x, y, image_array,
        image_length: image_array.length,
        type: hmUI.data_type.HEART,
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    })
    this.getObject("HeartProgress.CircleScale", (data) => {
      this.createWidget(hmUI.widget.ARC_PROGRESS, {
        type: hmUI.data_type.HEART,
        center_x: this.offsetX + data.CenterX,
        center_y: this.offsetY + data.CenterY,
        radius: data.RadiusX,
        start_angle: data.StartAngle,
        end_angle: data.EndAngle,
        line_width: data.Width,
        color: eval(data.Color),
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    })
    this.getObject("CaloriesProgress.LineScale", (scale) => {
      this.createWidget(hmUI.widget.IMG_LEVEL, {
        x: this.offsetX + scale.X,
        y: this.offsetY + scale.Y,
        type: hmUI.data_type.HEART,
        image_array: this.mkFontArrayFrom(scale.ImageIndex, scale.ImagesCount),
        image_length: scale.ImagesCount,
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    });
    this.getObject("CaloriesProgress.CircleScale", (data) => {
      this.createWidget(hmUI.widget.ARC_PROGRESS, {
        type: hmUI.data_type.CAL,
        center_x: this.offsetX + data.CenterX,
        center_y: this.offsetY + data.CenterY,
        radius: data.RadiusX,
        start_angle: data.StartAngle,
        end_angle: data.EndAngle,
        line_width: data.Width,
        color: eval(data.Color),
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    })

    // Weather
    this.getObject("Weather.Icon.CustomIcon", (obj) => {
      this.createWidget(hmUI.widget.IMG_LEVEL, {
        x: this.offsetX + obj.X,
        y: this.offsetY + obj.Y,
        type: hmUI.data_type.WEATHER_CURRENT,
        image_array: this.getWeatherIcons(obj.ImageIndex),
        image_length: 29,
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    })
    this.getObject("Weather.Temperature.Current", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.WEATHER_CURRENT,
        h_space: obj.Number.SpacingX,
        font_array: this.mkFontArrayFrom(obj.Number.ImageIndex, obj.Number.ImagesCount),
        negative_image: this.getFileFromID(obj.MinusImageIndex),
        unit_en: this.getFileFromID(obj.DegreesImageIndex),
        show_level: hmUI.show_level.ONLY_NORMAL,
        ...this.convertAlignProps(obj.Number)
      });
    });
    this.getObject("Weather.Temperature.Today.Separate.Day", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.WEATHER_HIGH,
        h_space: obj.Number.SpacingX,
        font_array: this.mkFontArrayFrom(obj.Number.ImageIndex, obj.Number.ImagesCount),
        negative_image: this.getFileFromID(obj.MinusImageIndex),
        unit_en: this.getFileFromID(obj.DegreesImageIndex),
        show_level: hmUI.show_level.ONLY_NORMAL,
        ...this.convertAlignProps(obj.Number)
      });
    });
    this.getObject("Weather.Temperature.Today.Separate.Night", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.WEATHER_LOW,
        h_space: obj.Number.SpacingX,
        font_array: this.mkFontArrayFrom(obj.Number.ImageIndex, obj.Number.ImagesCount),
        negative_image: this.getFileFromID(obj.MinusImageIndex),
        unit_en: this.getFileFromID(obj.DegreesImageIndex),
        show_level: hmUI.show_level.ONLY_NORMAL,
        ...this.convertAlignProps(obj.Number)
      });
    });
    this.getObject("Weather.Temperature.Today.OneLine", (obj) => {
      const view = this.createWidget(hmUI.widget.TEXT_IMG, {
        text: "",
        h_space: obj.Number.SpacingX,
        font_array: this.mkFontArrayFrom(obj.Number.ImageIndex, obj.Number.ImagesCount),
        negative_image: this.getFileFromID(obj.MinusSignImageIndex),
        dot_image: this.getFileFromID(obj.DelimiterImageIndex),
        unit_en: this.getFileFromID(obj.DegreesImageIndex),
        show_level: hmUI.show_level.ONLY_NORMAL,
        ...this.convertAlignProps(obj.Number)
      });

      updateHandlers.push(() => {
        let result = "";

        const forecast = weather.getForecastWeather();
        if(forecast.forecastData.count > 0) {
          const row = forecast.forecastData.data[0];
          result = String(row.high) + "." + String(row.low);
          if(obj.DegreesImageIndex) result += "u";
        }

        console.log(result);
        view.setProperty(hmUI.prop.TEXT, result);
      })
    });
    this.getObject("Weather.Humidity", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.HUMIDITY,
        font_array: this.mkFontArrayFrom(obj.Text.ImageIndex, obj.Text.ImagesCount),
        h_space: obj.Text.SpacingX,
        unit_en: this.getFileFromID(obj.SuffixImageIndex),
        show_level: hmUI.show_level.ONLY_NORMAL,
        ...this.convertAlignProps(obj.Text)
      })
    });
    this.getObject("Weather.AirPollution.Index", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.AQI,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        ...this.convertAlignProps(obj)
      })
    });
    this.getObject("Weather.Wind", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.WIND,
        font_array: this.mkFontArrayFrom(obj.Text.ImageIndex, obj.Text.ImagesCount),
        h_space: obj.Text.SpacingX,
        unit_en: this.getFileFromID(obj.ImageSuffixEN),
        show_level: hmUI.show_level.ONLY_NORMAL,
        ...this.convertAlignProps(obj.Text)
      })
    })

    // Status
    this.getObject("Status.DoNotDisturb", (status) => {
      this.createWidget(hmUI.widget.IMG_STATUS, {
        x: this.offsetX + status.Coordinates.X,
        y: this.offsetY + status.Coordinates.Y,
        src: this.getFileFromID(status.ImageIndexOn),
        type: hmUI.system_status.DISTURB,
        show_level: hmUI.show_level.ONLY_NORMAL
      });
    })
    this.getObject("Status.Bluetooth", (status) => {
      this.createWidget(hmUI.widget.IMG_STATUS, {
        x: this.offsetX + status.Coordinates.X,
        y: this.offsetY + status.Coordinates.Y,
        src: this.getFileFromID(status.ImageIndexOff),
        type: hmUI.system_status.DISCONNECT,
        show_level: hmUI.show_level.ONLY_NORMAL
      });
    })
    this.getObject("Status.Lock", (status) => {
      this.createWidget(hmUI.widget.IMG_STATUS, {
        x: this.offsetX + status.Coordinates.X,
        y: this.offsetY + status.Coordinates.Y,
        src: this.getFileFromID(status.ImageIndexOff),
        type: hmUI.system_status.LOCK,
        show_level: hmUI.show_level.ONLY_NORMAL
      });
    })

    this.getObject("Alarm.Text", (obj) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.ALARM_CLOCK,
        font_array: this.mkFontArrayFrom(obj.ImageIndex, obj.ImagesCount),
        h_space: obj.SpacingX,
        dot_image: this.getFileFromID(this.getObject("Alarm.DelimiterImageIndex")),
        show_level: hmUI.show_level.ONLY_NORMAL,
        align_h: hmUI.align.CENTER_H,
        ...this.convertAlignProps(obj)
      });
    });
    this.getObject("Alarm.ImageOff", (obj) => {
      this.createWidget(hmUI.widget.IMG, {
        x: this.offsetX + obj.X,
        y: this.offsetY + obj.Y,
        show_level: hmUI.show_level.ONLY_NORMAL,
        src: this.getFileFromID(obj.ImageIndex)
      })
    })
    this.getObject("Alarm.ImageOn", (obj) => {
      this.createWidget(hmUI.widget.IMG_STATUS, {
        x: this.offsetX + obj.X,
        y: this.offsetY + obj.Y,
        type: hmUI.system_status.CLOCK,
        show_level: hmUI.show_level.ONLY_NORMAL,
        src: this.getFileFromID(obj.ImageIndex)
      })
    })

    // Battety
    this.getObject("Battery.BatteryText", (battery) => {
      this.createWidget(hmUI.widget.TEXT_IMG, {
        type: hmUI.data_type.BATTERY,
        unit_en: this.getFileFromID(battery.SuffixImageIndex),
        font_array: this.mkFontArrayFrom(battery.Coordinates.ImageIndex, 10),
        h_space: battery.Coordinates.SpacingX,
        show_level: hmUI.show_level.ONLY_NORMAL,
        ...this.convertAlignProps(battery.Coordinates)
      })
    });
    this.getObject("Battery.BatteryIcon", (icon) => {
      this.createWidget(hmUI.widget.IMG_LEVEL, {
        x: this.offsetX + icon.X,
        y: this.offsetY + icon.Y,
        type: hmUI.data_type.BATTERY,
        image_array: this.mkFontArrayFrom(icon.ImageIndex, icon.ImagesCount),
        image_length: icon.ImagesCount,
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    });
    this.getObject("Battery.Linear", (obj) => {
      const x = [], y = [], image_array = [];
      const startID = obj.StartImageIndex;

      for(let i = 0; i < obj.Segments.length; i++) {
        x.push(obj.Segments[i].X + this.offsetX);
        y.push(obj.Segments[i].Y + this.offsetY);
        image_array.push(this.getFileFromID(startID + i));
      }

      this.createWidget(hmUI.widget.IMG_PROGRESS, {
        x, y, image_array,
        image_length: image_array.length,
        type: hmUI.data_type.BATTERY,
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    })

    // Animation
    this.getObject("Other.Animation", (gifs) => gifs.forEach((obj, i) => {
      this.createWidget(hmUI.widget.IMG_ANIM, {
        x: this.offsetX + obj.AnimationImages.X,
        y: this.offsetY + obj.AnimationImages.Y,
        anim_prefix: i.toString(),
        anim_path: this.path + "gif",
        anim_ext: "png",
        anim_fps: obj.Speed,
        repeat_count: obj.RepeatCount > 1 ? 0 : 1,
        anim_size: obj.AnimationImages.ImagesCount,
        anim_status: hmUI.anim_status.START,
        show_level: hmUI.show_level.ONLY_NORMAL
      })
    }))


    // Update all
    for(let i in updateHandlers) updateHandlers[i]();
    this.updateHandlers = updateHandlers
  }

  update() {
    let updateHandlers = this.updateHandlers;
    for(let i in updateHandlers) updateHandlers[i]();
  }

  initAutoUpdate() {
    this.createTimer(0, 5000, () => {
      this.update();
    });

    this.createWidget(hmUI.widget.WIDGET_DELEGATE, {
      resume_call: () => {
        this.update();
      },
    });
  }
}
