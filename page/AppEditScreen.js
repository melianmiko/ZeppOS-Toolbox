import { ListScreen } from "../lib/mmk/ListScreen";
import { AppGesture } from "../lib/mmk/AppGesture";
import {FsTools, Path} from "../lib/mmk/Path";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../lib/mmk/UiParams";

const { config, t } = getApp()._options.globalData;

class AppEditScreen extends ListScreen {
	constructor(dirname) {
		super();
    this.fontSize = config.get("fontSize", this.fontSize);
		
		this.dirname = dirname;
		this.dontKeepSettings = true;
		this.entry = new Path("full", `/storage/js_apps/${dirname}`);
		this.dataEntry = new Path("full", `/storage/js_apps/data/${dirname}`);
		this.appConfig = {};
	}

	start() {
		this.preloadAll();

		let size = this.entry.size();
		this.image({
			src: this.iconPath,
			height: 100
		});
		this.text({
			text: this.appConfig.app.appName,
			fontSize: this.fontSize + 4
		});

		this.field({
			headline: t("Vendor"),
			text: this.appConfig.app.vender
		})
		this.field({
			headline: t("Size"),
			text: FsTools.printBytes(size)
		})

		this.row({
			text: t("Launch"),
			icon: "menu/play.png",
			callback: () => {
				hmApp.startApp({
					appid: this.appConfig.app.appId,
					url: this.appConfig.module.page.pages[0]
				});
			}
		});

		this.row({
			text: t("Uninstall"),
			color: 0xFF8888,
			icon: "menu/delete.png",
			callback: () => {
				this.uninstall();
			}
		})

		this.headline(t("Advanced"));

		this.field({
			headline: "ID (dec / hex)",
			text: `${this.appConfig.app.appId} / ${this.dirname}`
		});
		this.row({
			text: t("Show in file manager"),
			icon: "menu/files.png",
			callback: () => {
				const path = `/storage/js_apps/${this.dirname}`;
				hmApp.gotoPage({
					url: "page/FileManagerScreen",
					param: JSON.stringify({
						path
					})
				})
			}
		});

		if(this.appConfig.externalFilesList) {
			let configSize = 0;
			for(const path of this.appConfig.externalFilesList) {
				const [st, e] = new Path("full", path).stat();
				if(st !== null && st.size) configSize += st.size;
			}

			this.field({
				headline: t("Size (ext. config)"), 
				text: FsTools.printBytes(configSize)
			});
		}

		this.offset();
		this._prepareFinishGroup();
	}

	preloadAll() {
		try {
			this.appConfig = this.entry.get("app.json").fetchJSON();

			let icon = this.entry.get(`assets/${this.appConfig.app.icon}`);
			this.iconPath = this._prepareTempFile(icon);
		} catch (e) {
			console.log(e);
		}
	}

	_prepareFinishGroup() {
		const group = hmUI.createWidget(hmUI.widget.GROUP, {
			x: 0,
			y: 0,
			w: SCREEN_WIDTH,
			h: SCREEN_HEIGHT
		});
		group.createWidget(hmUI.widget.FILL_RECT, {
			x: 0,
			y: 0,
			w: SCREEN_WIDTH,
			h: SCREEN_HEIGHT,
			color: 0x0
		});
		group.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 120,
			w: SCREEN_WIDTH,
			h: 48,
			text_size: 26,
			text_style: hmUI.text_style.WRAP,
			align_h: hmUI.align.CENTER_H,
			color: 0x66BB6A,
			text: t("Uninstalled")
		});
		group.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 180,
			w: SCREEN_WIDTH,
			h: 120,
			text_size: 20,
			text_style: hmUI.text_style.WRAP,
			align_h: hmUI.align.CENTER_H,
			color: 0xffffff,
			text: t("Please reboot device to finish")
		});

		group.createWidget(hmUI.widget.IMG, {
			x: 0,
			y: 400,
			w: SCREEN_WIDTH,
			h: 48,
			pos_x: (192-48)/2,
			pos_y: 0,
			src: "i_next.png"
		}).addEventListener(hmUI.event.CLICK_UP, () => {
			hmApp.startApp({
				url: "Settings_systemScreen",
				native: true
			});
		});

		group.setProperty(hmUI.prop.VISIBLE, false);
		this.finishGroup = group;
	}

	_prepareTempFile(sourceEntry) {
    const current = config.get("imageViewTempFile", false);
    if(current) {
      new Path("assets", current).remove();
    }

    // const data = FsUtils.read(sourcePath);
    const newFile = "temp_" + Math.round(Math.random() * 100000) + ".png";
    const dest = new Path("assets", newFile);
    console.log(`Copy ${sourceEntry.absolutePath} to ${dest.absolutePath}`)
    sourceEntry.copy(dest);

    config.set("imageViewTempFile", newFile);
    return newFile;
	}

	uninstall() {
		this.entry.removeTree();
		this.dataEntry.removeTree();

		if(this.appConfig.externalFilesList) {
			for(const path of this.appConfig.externalFilesList) {
				try {
					new Path("full", path).remove();
				} catch(e) {
					console.log(e);
				}
			}
		}

		hmApp.setLayerY(0);
		hmUI.setLayerScrolling(false);
		this.finishGroup.setProperty(hmUI.prop.VISIBLE, true);
	}
}


Page({
	onInit(dirname) {
		AppGesture.withYellowWorkaround("left", {
			appid: 33904,
			url: "page/AppEditScreen",
		});
		AppGesture.init();

		this.screen = new AppEditScreen(dirname);
		this.screen.start();
	}
});
