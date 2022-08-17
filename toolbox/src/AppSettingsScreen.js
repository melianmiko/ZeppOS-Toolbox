class AppSettingsScreen {
  ROW_ITEM = {
    type_id: 1,
    item_height: 64,
    item_bg_color: 0x222222,
    item_bg_radius: 12,
    text_view: [{
      x: 56,
      y: 0,
      w: 108,
      h: 64,
      key: "name",
      color: 0xffffff,
      text_size: 22
    }],
    text_view_count: 1,
    image_view: [{
      x: 16,
      y: 20,
      w: 24,
      h: 24,
      key: "icon"
    }],
    image_view_count: 1
  }

  ROWS = [
  	{name: t("settings_ui"), target: "cfg_ui", icon: "menu/ui.png"},
  	{name: t("settings_lang"), target: "cfg_lang", icon: "menu/lang.png"},
  	{name: t("action_info"), target: "about", icon: "menu/info.png"},
  ];

  start() {
  	hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
      x: 12,
      y: 64,
      w: 192-24,
      h: 362,
      item_space: 12,
      item_config: [this.ROW_ITEM],
      item_config_count: 1,
      item_click_func: (_, i) => this.onSelect(i),
      data_type_config: [{
      	start: 0,
      	end: this.ROWS.length-1,
      	type_id: 1
      }],
      data_type_config_count: 1,
      data_array: this.ROWS,
      data_count: this.ROWS.length
    })
  }

  onSelect(i) {
  	const data = this.ROWS[i];
  	gotoSubpage(data.target);
  }
}