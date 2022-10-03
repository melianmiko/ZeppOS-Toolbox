const EDIT_BARS = {
  steps: {
    value: 0,
    dataType: hmUI.data_type.STEP,
    url: "activityAppScreen",
    font: "sm_yellow",
    color: 0xffe30b,
  },
  km: {
    value: 5,
    dataType: hmUI.data_type.DISTANCE,
    progressDataType: hmUI.data_type.STEP,
    dotImage: "fonts/sm_lightblue/11.png",
    url: "activityAppScreen",
    font: "sm_lightblue",
    color: 0x0dd3ff,
  },
  consume: {
    value: 1,
    dataType: hmUI.data_type.CAL,
    url: "activityAppScreen",
    font: "sm_orange",
    color: 0xff8a00,
  },
  pai: {
    value: 2,
    dataType: hmUI.data_type.PAI_WEEKLY,
    url: "pai_app_Screen",
    font: "sm_blue",
    color: 0x5f64fa,
  },
  battery: {
    value: 3,
    dataType: hmUI.data_type.BATTERY,
    unit: "fonts/sm_green/10.png",
    url: false,
    font: "sm_green",
    color: 0x02fa7a,
  },
  heartrate: {
    value: 4,
    dataType: hmUI.data_type.HEART,
    url: "heart_app_Screen",
    font: "sm_red",
    color: 0xff0038,
  },
  stress: {
    value: 6,
    dataType: hmUI.data_type.STRESS,
    url: "StressHomeScreen",
    font: "sm_stress",
    color: 0x00bd9d,
  },
  stand: {
    value: 7,
    dataType: hmUI.data_type.STAND,
    url: "activityAppScreen",
    font: "sm_green",
    color: 0x36cf6e
  },
  spo2: {
    value: 8,
    dataType: hmUI.data_type.SPO2,
    url: "spo_HomeScreen",
    font: "sm_red",
    color: 0xff0000
  },
  void: {
    value: 99
  }
};

const FONT_WHITE = mkImgArray("fonts/white");
const EDIT_WIDGETS = {
  weather: {
    value: 0,
    url: "WeatherScreen",
    render: (y) => {
      hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
        x: 74,
        y,
        image_array: mkImgArray("widgets/weather", 29),
        image_length: 29,
        type: hmUI.data_type.WEATHER_CURRENT,
        show_level: hmUI.show_level.ONLY_NORMAL,
      });

      hmUI.createWidget(hmUI.widget.TEXT_IMG, {
        x: 48,
        y: y + 48,
        w: 96,
        h: 30,
        align_h: hmUI.align.CENTER_H,
        invalid_image: "fonts/null.png",
        negative_image: "fonts/fu.png",
        show_level: hmUI.show_level.ONLY_NORMAL,
        type: hmUI.data_type.WEATHER_CURRENT,
        font_array: FONT_WHITE,
        unit_en: "fonts/du.png",
        unit_sc: "fonts/du.png",
        unit_tc: "fonts/du.png",
      });
    }
  },
  heartrate: {
    value: 1,
    url: "heart_app_Screen",
    config: {
      type: hmUI.data_type.HEART,
      font_array: mkImgArray("fonts/red"),
    },
  },
  aqi: {
    value: 2,
    url: "WeatherScreen",
    config: {
      type: hmUI.data_type.AQI,
      font_array: FONT_WHITE,
    },
  },
  battery: {
    value: 3,
    url: "",
    config: {
      type: hmUI.data_type.BATTERY,
      font_array: mkImgArray("fonts/green"),
      unit_en: "fonts/present.png",
      unit_sc: "fonts/present.png",
      unit_tc: "fonts/present.png",
    },
  },
  humidity: {
    value: 4,
    url: "WeatherScreen",
    config: {
      type: hmUI.data_type.HUMIDITY,
      font_array: mkImgArray("fonts/blue"),
    },
  },
  steps: {
    value: 5,
    url: "activityAppScreen",
    config: {
      type: hmUI.data_type.STEP,
      font_array: mkImgArray("fonts/yellow"),
    },
  },
  sunrise: {
    value: 6,
    url: "WeatherScreen",
    config: {
      type: hmUI.data_type.SUN_RISE,
      font_array: FONT_WHITE,
    },
  },
  sunset: {
    value: 7,
    url: "WeatherScreen",
    config: {
      type: hmUI.data_type.SUN_SET,
      font_array: FONT_WHITE,
    },
  },
  uvi: {
    value: 8,
    url: "WeatherScreen",
    config: {
      type: hmUI.data_type.UVI,
      font_array: FONT_WHITE,
    },
  },
  countdown: {
    value: 9,
    url: "CountdownAppScreen",
    render: (y) => {
      hmUI.createWidget(hmUI.widget.IMG, {
        x: 48,
        y,
        src: "widgets/demo/countdown.png"
      });
    }
  },
  stopwatch: {
    value: 10,
    url: "StopWatchScreen",
    render: (y) => {
      hmUI.createWidget(hmUI.widget.IMG, {
        x: 48,
        y,
        src: "widgets/demo/stopwatch.png"
      });
    }
  },
  tb_timer: {
    value: 11,
    url: () => {
      hmApp.startApp({
        appid: 33904,
        url: 'page/TimerSetScreen'
      });
    },
    render: (y) => {
      hmUI.createWidget(hmUI.widget.IMG, {
        x: 74,
        y,
        src: `widgets/icon/tb_timer.png`,
        show_level: hmUI.show_level.ONLY_NORMAL
      });
      const view = hmUI.createWidget(hmUI.widget.TEXT_IMG, {
        x: 48,
        y: y + 48,
        w: 96,
        h: 30,
        align_h: hmUI.align.CENTER_H,
        negative_image: "fonts/fu.png",
        dot_image: 'fonts/point.png',
        show_level: hmUI.show_level.ONLY_NORMAL,
        text: getTbTimerState(),
        font_array: FONT_WHITE,
      });

      timer.createTimer(0, 500, () => {
        view.setProperty(hmUI.prop.TEXT, getTbTimerState());
      });
    }
  },
  sleep: {
    value: 12,
    url: "Sleep_HomeScreen",
    config: {
      type: hmUI.data_type.SLEEP,
      font_array: FONT_WHITE,
      dot_image: 'fonts/white/10.png',
    },
  },
  alarm: {
    value: 13,
    url: "AlarmInfoScreen",
    config: {
      type: hmUI.data_type.ALARM_CLOCK,
      font_array: FONT_WHITE,
      padding: 1,
    },
  },
  void: {
    value: 99
  }
};
