import { FsUtils } from "../../lib/FsUtils";

function render() {
	const data = FsUtils.fetchJSON("config.json");

	if(data.length === 0) {
		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 0,
			w: 192,
			h: 490,
			text: "<---\nSwipe to edit",
			color: 0x999999,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V
		})
	}

	data.push({name: "", icon: ""});

	hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
		x: 0,
		y: 10,
		w: 192,
		h: 480,
		item_click_func: (_, index) => {
			hmApp.startApp(data[index].request);
		},
		item_space: 8,
		data_array: data,
		data_count: data.length,
		data_type_config: [
			{
				start: 0,
				end: data.length - 1,
				type_id: 1,
			}
		],
		data_type_config_count: 1,
		item_config_count: 1,
		item_config: [
			{
				type_id: 1,
				item_bg_color: 0x0,
				item_bg_radius: 0,
				item_height: 164,
				text_view: [
					{
						x: 0,
						y: 108,
						w: 192,
						h: 40,
						text_size: 28,
						key: "name",
						color: 0xffffff,
					},
				],
				text_view_count: 1,
				image_view: [
					{
						x: 46,
						y: 0,
						w: 100,
						h: 100,
						key: "icon",
					},
				],
				image_view_count: 1,
			}
		],
	});
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
	onInit() {
		hmUI.setLayerScrolling(false);
		hmApp.registerGestureEvent((e) => {
			if (e === hmApp.gesture.LEFT) {
				hmApp.unregisterGestureEvent();
				hmApp.gotoPage({ url: "page/ConfigureScreen" });
				return true;
			}

			return false;
		});

		render();
	},
});
