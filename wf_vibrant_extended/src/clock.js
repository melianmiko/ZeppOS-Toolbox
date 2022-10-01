function renderClockWidget(isAOD) {
  const isEdit = hmSetting.getScreenType() == hmSetting.screen_type.SETTINGS;

  const editor = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_GROUP, {
    edit_id: 120,
    x: 0,
    y: 145,
    w: 182,
    h: 200,
    select_image: "edit/main.png",
    un_select_image: "edit/main_w.png",
    default_type: 0,
    optional_types: [
      { type: 0, preview: "edit/clock_analog.png" },
      { type: 1, preview: "edit/clock_digital.png" },
      { type: 2, preview: "edit/clock_gray.png" }
    ],
    count: 3,
    tips_BG: "",
    tips_x: -1000,
    tips_y: 0,
    tips_width: 1,
  });

  if(isEdit) return;
  
  const value = editor.getProperty(hmUI.prop.CURRENT_TYPE);

  switch (value) {
    case 1:
      isAOD ? _renderTimeDigital_aod() : _renderTimeDigital();
      break;
    case 2:
      isAOD ? _renderTimeAnalog_aod('gray') : _renderTimeAnalog('gray');
      break
    default:
      isAOD ? _renderTimeAnalog_aod('white') : _renderTimeAnalog('white');
  }
}

function _renderTimeAnalog(skinName) {
  // BG
  hmUI.createWidget(hmUI.widget.IMG, {
    x: 0,
    y: 0,
    src: `pointer/${skinName}/bg.png`,
    show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_AOD,
  });

  // Time pointer
  hmUI.createWidget(hmUI.widget.TIME_POINTER, {
    hour_centerX: 96,
    hour_centerY: 245,
    hour_posX: 12,
    hour_posY: 69,
    hour_path: "pointer/hour.p.png",
    minute_centerX: 96,
    minute_centerY: 245,
    minute_posX: 12,
    minute_posY: 86,
    minute_path: "pointer/minute.p.png",
    minute_cover_path: "pointer/center.png",
    minute_cover_x: 84,
    minute_cover_y: 233,
    second_centerX: 96,
    second_centerY: 245,
    second_posX: 6,
    second_posY: 98,
    second_path: "pointer/second.p.png",
    show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_AOD,
  });
}

function _renderTimeAnalog_aod(skinName) {
  // BG
  hmUI.createWidget(hmUI.widget.IMG, {
    x: 0,
    y: 0,
    src: `pointer/${skinName}/bg2.png`,
    show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONLY_AOD,
  });

  // Time pointer
  hmUI.createWidget(hmUI.widget.TIME_POINTER, {
    hour_centerX: 96,
    hour_centerY: 245,
    hour_posX: 12,
    hour_posY: 69,
    hour_path: "pointer/hour.p.png",
    minute_centerX: 96,
    minute_centerY: 245,
    minute_posX: 12,
    minute_posY: 86,
    minute_path: "pointer/minute.p.png",
    minute_cover_path: "pointer/center2.png",
    minute_cover_x: 84,
    minute_cover_y: 233,
  });
}
