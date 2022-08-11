const ABOUT_DATA = `
Toolbox
v2022-08-11
by melianmiko

Thanks to:
-- Zhenyok905 --
BandBBS publisher
`;

class AboutScreen {
	start() {
		hmUI.createWidget(hmUI.widget.TEXT, {
			x: 0,
			y: 0,
			w: 192,
			h: 490,
			align_h: hmUI.align.CENTER_H,
			align_v: hmUI.align.CENTER_V,
			text: ABOUT_DATA,
			text_size: 20,
			color: 0xffffff,
			text_style: hmUI.text_style.WRAP
		});
	}
}