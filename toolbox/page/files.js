(() => {
	const FILE_ROW_TYPE = {
		type_id: 1,
		item_height: 64,
		item_bg_color: 0x222222,
		item_bg_radius: 12,
		text_view: [{
			x: 56,
			y: 0,
			w: 112,
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
	};

	class Fileman {
		path = "/storage";
		rootfs = "/storage";
		editPath = null;
		content = [];
		rows = [];

		constructor() {
			const pkg = hmApp.packageInfo();
			const idn = pkg.appId.toString(16).padStart(8, "0").toUpperCase();
			this.path = "/storage/js_" + pkg.type + "s/" + idn;

			const lastPath = hmFS.SysProGetChars("mmk_tb_lastpath");
			if(!!lastPath) this.path = lastPath;
		}

		start() {
			this.viewPath = hmUI.createWidget(hmUI.widget.TEXT, {
				x: 48,
				y: 0,
				w: 96,
				h: 64,
				align_h: hmUI.align.CENTER_H,
				align_v: hmUI.align.CENTER_V,
				text: "loading",
				color: 0xffffff
			});

			this.viewFiles = hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
				x: 12,
				y: 64,
				w: 192-24,
				h: 362,
				item_space: 12,
				item_config: [FILE_ROW_TYPE],
				item_config_count: 1,
				item_click_func: (_, i) => this.onRowClick(i),
				data_type_config: [],
				data_type_config_count: 0,
				data_array: [],
				data_count: 0
			});

			hmUI.createWidget(hmUI.widget.BUTTON, {
				x: 0,
				y: 426,
				w: 192,
				h: 64,
				text: "...",
				click_func: () => this.modify(this.path)
			});

			// Run
			this.applyPath(this.path);
		}

		modify(path) {
			hmApp.gotoPage({
				url: "page/file_edit",
				param: path
			})
		}

		applyPath(path) {
			this.path = path;
			this.refresh();
			hmFS.SysProSetChars("mmk_tb_lastpath", path);
		}

		stat(path) {
			const statPath = "../../../" + path.substring(9);
			return hmFS.stat_asset(statPath);
		}

    isFolder(path) {
        const [st, e] = this.stat(path);
        if(st == null) return true; // force for unavailables
        return (st.mode & 32768) == 0;
    }

		refresh() {
			const [files, e] = hmFS.readdir(this.path);
			console.log("refr", this.path);

			if (this.path == this.rootfs) {
				this.contents = [...files];
			} else {
				this.contents = ["..", ...files];
			}

			this.viewPath.setProperty(hmUI.prop.TEXT, this.path);

			this.viewFiles.setProperty(hmUI.prop.UPDATE_DATA, {
				data_type_config: [{
					start: 0,
					end: this.contents.length-1,
					type_id: 1,
				}],
				data_type_config_count: 1,
				data_count: this.contents.length,
				data_array: this.contents.map((name) => {
					const isDir = this.isFolder(this.path + "/" + name);

					return {
						name,
						icon: isDir ? "folder.png" : "file.png"
					};
				}),
				on_page: 1
			})
		}

		onRowClick(i) {
			const val = this.contents[i];
			if (!val) return;

			let path = this.path + "/" + val;
			if (val == "..") {
				path = this.path.substring(0, this.path.lastIndexOf("/"));
			}

			if (this.isFolder(path)) {
				// Directory
				console.log("newpath", path);
				this.applyPath(path);
			} else {
				this.modify(path);
			}
		}
	}

	let __$$app$$__ = __$$hmAppManager$$__.currentApp;
	let __$$module$$__ = __$$app$$__.current;
	__$$module$$__.module = DeviceRuntimeCore.Page({
		onInit() {
			(new Fileman()).start();
		},
	});
})();
