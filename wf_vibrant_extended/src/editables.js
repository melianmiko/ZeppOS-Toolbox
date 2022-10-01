function renderWidgets() {
  const urls = [];
  const isEdit = hmSetting.getScreenType() == hmSetting.screen_type.SETTINGS;

  for(let i = 0; i < 2; i++) {
    const editView = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_GROUP, {
      edit_id: 110 + i,
      x: 48,
      y: i == 0 ? 36 : 376,
      w: 96,
      h: 78,
      select_image: 'edit/center.png',
      un_select_image: 'edit/center_w.png',
      default_type: i,
      optional_types: Object.keys(EDIT_WIDGETS).map((key) => {
        const data = EDIT_WIDGETS[key];
        return {
          type: data.value,
          preview: `widgets/demo/${key}.png`
        }
      }),
      count: Object.keys(EDIT_WIDGETS).length,
      tips_BG: "",
      tips_x: -1000,
      tips_y: 0,
      tips_width: 1
    });

    if(isEdit) continue;

    // Fetch current
    const current = editView.getProperty(hmUI.prop.CURRENT_TYPE);

    let currentKey = 'weather';
    for(let i in EDIT_WIDGETS) {
      if(EDIT_WIDGETS[i].value === current) {
        currentKey = i;
        break;
      }
    }

    const currentData = EDIT_WIDGETS[currentKey];
    _drawWidget(i, currentKey, currentData);
    urls.push(currentData.url);
  }

  return urls;
}

function _drawWidget(i, currentKey, currentData) {
  if(i == 99) return;
  if(currentData.render) {
    currentData.render(i == 0 ? 36 : 376);
    return
  }

  // Icon
  hmUI.createWidget(hmUI.widget.IMG, {
    x: 74,
    y: i == 0 ? 36 : 376,
    src: `widgets/icon/${currentKey}.png`,
    show_level: hmUI.show_level.ONLY_NORMAL
  })
  hmUI.createWidget(hmUI.widget.TEXT_IMG, {
    x: 48,
    y: i == 0 ? 84 : 424,
    w: 96,
    h: 30,
    align_h: hmUI.align.CENTER_H,
    invalid_image: 'fonts/null.png',
    negative_image: 'fonts/fu.png',
    dot_image: 'fonts/point.png',
    show_level: hmUI.show_level.ONLY_NORMAL,
    ...currentData.config
  });
}

function renderBars() {
  const urls = [];
  const isEdit = hmSetting.getScreenType() == hmSetting.screen_type.SETTINGS;

  for(let i = 0; i < 4; i++) {
    const editView = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_GROUP, {
      edit_id: 101 + i,
      x: i % 2 == 1 ? 94 : 2,
      y: i > 1 ? 352 : 4,
      w: 96,
      h: 136,
      select_image: `edit/${i}a.png`,
      un_select_image: `edit/${i}.png`,
      default_type: i,
      optional_types: Object.keys(EDIT_BARS).map((key) => {
        const data = EDIT_BARS[key];
        return {
          type: data.value,
          preview: `bars/${i}/demo/${key}.png`
        }
      }),
      count: Object.keys(EDIT_BARS).length,
      tips_BG: "",
      tips_x: -1000,
      tips_y: 0,
      tips_width: 1
    });

    if(isEdit) continue;

    // Fetch current
    const current = editView.getProperty(hmUI.prop.CURRENT_TYPE);

    let currentKey = 'steps';
    for(let i in EDIT_BARS) {
      if(EDIT_BARS[i].value === current) {
        currentKey = i;
        break;
      }
    }

    const currentData = EDIT_BARS[currentKey];
    _drawBar(i, currentKey, currentData);
    urls.push(currentData.url);
  }

  return urls;
}


function _drawBar(i, currentKey, currentData) {
  if(i == 99) return;

  // Draw BG
  hmUI.createWidget(hmUI.widget.IMG, {
    x: i % 2 == 1 ? 96 : 0,
    y: i > 1 ? 364 : 0,
    src: `bars/${i}/${currentKey}.png`,
    show_level: hmUI.show_level.ONLY_NORMAL
  });

  // Draw ARC_PROGRESS
  const view = hmUI.createWidget(hmUI.widget.ARC_PROGRESS, {
    type: currentData.progressDataType ? currentData.progressDataType :
      currentData.dataType,
    center_x: 96,
    center_y: i > 1 ? 392 : 96,
    radius: 82,
    start_angle: i % 2 == 0 ? -90 : 90,
    end_angle: ([-12, 12, -168, 168])[i],
    line_width: 20,
    color: currentData.color,
    show_level: hmUI.show_level.ONLY_NORMAL
  });

  // Draw TEXT
  hmUI.createWidget(hmUI.widget.TEXT_IMG, {
    x: i % 2 == 1 ? 96 : 4,
    y: i > 1 ? 370 : 100,
    w: 92,
    font_array: mkImgArray(`fonts/${currentData.font}`),
    align_h: i % 2 == 1 ? hmUI.align.RIGHT : hmUI.align.LEFT,
    type: currentData.dataType,
    dot_image: currentData.dotImage,
    unit_en: currentData.unit,
    show_level: hmUI.show_level.ONLY_NORMAL
  })
}