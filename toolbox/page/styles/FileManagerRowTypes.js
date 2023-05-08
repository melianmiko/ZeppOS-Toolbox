export const HEADER_ROW_TYPE = {
  type_id: 1,
  item_height: 96,
  item_bg_color: 0x0,
  item_bg_radius: 0,
  text_view: [{
    x: 4,
    y: 64,
    w: 172,
    h: 32,
    key: "title",
    color: 0xEEEEEE,
  }],
  text_view_count: 1,
  image_view: [{
    x: 84,
    y: 24,
    w: 24,
    h: 24,
    key: "icon"
  }],
  image_view_count: 1
};

export const FILE_ROW_TYPE = {
  type_id: 2,
  item_height: 64,
  item_bg_color: 0x111111,
  item_bg_radius: 12,
  text_view: [{
    x: 44,
    y: 0,
    w: 144,
    h: 64,
    key: "name",
    color: 0xffffff,
    text_size: 22
  }],
  text_view_count: 1,
  image_view: [{
    x: 10,
    y: 20,
    w: 24,
    h: 24,
    key: "icon"
  }],
  image_view_count: 1
};

export const FILE_ROW_TYPE_WITH_SIZE = {
  type_id: 3,
  item_height: 64,
  item_bg_color: 0x111111,
  item_bg_radius: 12,
  text_view: [
    {
      x: 44,
      y: 0,
      w: 144,
      h: 32,
      key: "name",
      color: 0xffffff,
      text_size: 22
    },
    {
      x: 44,
      y: 32,
      w: 144,
      h: 24,
      key: "size",
      color: 0xAAAAAA,
      text_size: 20,
    },
  ],
  text_view_count: 2,
  image_view: [{
    x: 10,
    y: 20,
    w: 24,
    h: 24,
    key: "icon"
  }],
  image_view_count: 1
}
