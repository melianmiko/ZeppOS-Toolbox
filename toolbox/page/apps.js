(() => {
	class FsUtils {
		static fetchTextFile(fn) {
			if(fn.startsWith("/storage"))
				fn = "../../../" + fn.substring(9);

			const st = hmFS.stat_asset(fn)[0];
			const f = hmFS.open(fn, hmFS.O_RDONLY);
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

	// List apps
	const fetchApps = () => {
		const out = [];
		const [contents, e] = hmFS.readdir("/storage/js_apps");

		for(let i in contents) {
			let name = "",
				data = "";
			const dirname = contents[i];
			if(dirname == "data") continue;

			try {
				const path = "/storage/js_apps/" + dirname + "/app.json";
				const appConfig = FsUtils.fetchJSON(path);
				name = appConfig.app.appName;
				data = dirname + ";" + name;

				out.push({name, data});
			} catch(e) {
				console.warn(e);
			}
		}

		return out;
	}

	// Render UI
	const init_ui = () => {
		const apps = fetchApps();

		const app_list_item_type = {
			type_id: 1,
			item_height: 64,
			item_bg_color: 0x222222,
			item_bg_radius: 8,
			text_view: [
				{
					x: 0,
					y: 0,
					w: 192-16,
					h: 64,
					key: "name",
					color: 0xffffff,
					text_size: 26,
				},
			],
			text_view_count: 1,
		};

		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 48,
			y: 0,
			w: 96,
			h: 64,
			text: "Apps",
			color: 0xffffff,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V
		})

		hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
			x: 8,
			y: 64,
			w: 192-16,
			h: 445,
			item_space: 8,
			item_config: [app_list_item_type],
			item_config_count: 1,
			item_click_func: (list, index) => {
				const data = apps[index].data;
				hmApp.gotoPage({
					url: "page/delete_confirm",
					param: data,
				});
			},
			data_type_config: [
				// { start: 0, end: 0, type_id: 2 },
				{ start: 0, end: apps.length-1, type_id: 1 }
			],
			data_type_config_count: 1,
			data_array: apps,
			data_count: apps.length,
		});
	};

	let __$$app$$__ = __$$hmAppManager$$__.currentApp;
	let __$$module$$__ = __$$app$$__.current;
	__$$module$$__.module = DeviceRuntimeCore.Page({
		build() {
			hmUI.setLayerScrolling(false);

			init_ui();
		},
	});
})();
