const osLang = DeviceRuntimeCore.HmUtils.getLanguage();
const wdPosX = {
  "ru-RU": 120,
  "en-US": 104,
  "zh-CN": 111,
  "zh-TW": 111
};

function _renderTimeDigital_aod() {
  renderDate();

  hmUI.createWidget(hmUI.widget.IMG_TIME, {
    hour_startX: 26,
    hour_startY: 125,
    hour_zero: 1,
    hour_array: mkImgArray('digital/clock/aod'),
    minute_startX: 26,
    minute_startY: 230,
    minute_zero: 1,
    minute_array: mkImgArray('digital/clock/aod')
  });
}

function _renderTimeDigital() {
  renderDate();

  hmUI.createWidget(hmUI.widget.IMG_TIME, {
    hour_startX: 26,
    hour_startY: 125,
    hour_zero: 1,
    hour_array: mkImgArray('digital/clock/normal'),
    minute_startX: 26,
    minute_startY: 230,
    minute_zero: 1,
    minute_array: mkImgArray('digital/clock/normal')
  });
}

function renderDate() {
  const fontDate = mkImgArray("digital/date");
  hmUI.createWidget(hmUI.widget.IMG_DATE, {
    month_startX: 30,
    month_startY: 336,
    month_en_array: fontDate,
    month_sc_array: fontDate,
    month_tc_array: fontDate,
    month_unit_en: 'digital/date/11.png',
    month_unit_sc: 'digital/date/11.png',
    month_unit_tc: 'digital/date/11.png',
    month_zero: 1,
    day_follow: 1,
    day_en_array: fontDate,
    day_sc_array: fontDate,
    day_tc_array: fontDate,
    day_zero: 1
  });

  const fontWeekday = mkImgArray('weekday', 7);
  const x = wdPosX[osLang] ? wdPosX[osLang] : 120;

  hmUI.createWidget(hmUI.widget.IMG_WEEK, {
    x,
    y: 336,
    week_en: mkImgArray(`weekday/${osLang}`, 7),
    week_sc: mkImgArray(`weekday/zh-CN`, 7),
    week_tc: mkImgArray(`weekday/zh-TW`, 7)
  });
}
