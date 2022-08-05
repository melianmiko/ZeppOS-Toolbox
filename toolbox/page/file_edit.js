(() => {
	let targetPath = "";

	function delTree(path) {
		const [files, e] = hmFS.readdir(path);

		for(let i in files) {
			delTree(path + "/" + files[i]);
		}

		console.log(path);
		hmFS.remove(path);
	}

	function actionDelete() {
		delTree(targetPath);
		hmApp.goBack();
	}

	function build() {
		let text = targetPath + "\n\n";

		try {
			const statPath = "../../../" + targetPath.substring(9);
			const [st, e] = hmFS.stat_asset(statPath);

			for(let key in st) {
				text += key + ": " + st[key] + "\n";
			}
		} catch(e) {
			console.warn(e);
		}

		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 12,
			y: 72,
			w: 168,
			h: 240,
			color: 0xffffff,
			text_style: hmUI.text_style.WRAP,
			text
		});

		hmUI.createWidget(hmUI.widget.BUTTON, {
			x: 0,
			y: 380,
			w: 192,
			h: 64,
			color: 0xff0000,
			text: "Delete",
			click_func: () => actionDelete()
		})
	}



	let __$$app$$__ = __$$hmAppManager$$__.currentApp;
	let __$$module$$__ = __$$app$$__.current;
	__$$module$$__.module = DeviceRuntimeCore.Page({
		onInit(p) {
			targetPath = p;

			build();
		},
	});
})();