(() => {
	let displayName = "??", dirname = "??";

	function delTree(path) {
		const [files, e] = hmFS.readdir(path);

		for(let i in files) {
			delTree(path + "/" + files[i]);
		}

		console.log(path);
		hmFS.remove(path);
	}

	function uninstall() {
		const path = "/storage/js_apps/" + dirname;

		delTree(path);
		hmFS.remove("/storage/js_apps/data" + dirname);

		hmUI.showToast({text: "Deleted"});
		hmApp.gotoHome();
	}

	function setupUI() {
		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 64,
			w: 192,
			text: displayName,
			color: 0xffffff,
			text_size: 26,
			align_h: hmUI.align.CENTER_H
		});

		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 120,
			w: 192,
			text: "Don't fogot to reboot after uninstall!",
			text_style: hmUI.text_style.WRAP,
			color: 0xffffff,
			align_h: hmUI.align.CENTER_H
		});

		hmUI.createWidget(hmUI.widget.BUTTON, {
			x: 8,
			y: 240,
			w: 192-16,
			h: 64,
			color: 0xff2222,
			text: "Uninstall",
			click_func: () => uninstall()
		});
	}

	let __$$app$$__ = __$$hmAppManager$$__.currentApp;
	let __$$module$$__ = __$$app$$__.current;
	__$$module$$__.module = DeviceRuntimeCore.Page({
		onInit(p) {
			[dirname, displayName] = p.split(";");

			setupUI();
		}
	});
})();
