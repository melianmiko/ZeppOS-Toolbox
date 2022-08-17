class PixelDisplay {
	views = [];

	constructor(screenY, sw=8, sh=8) {
		this.screenY = screenY;
		this.screenWidth = sw;
		this.screenHeight = sh;
		this.lastData = new Uint8Array(sw * sh);

		this._makeView();
	}

	_makeView() {
		const tileSize = Math.floor(192 / this.screenWidth);
		const ox = (192 - tileSize * this.screenWidth)/2;
		const oy = (490 - tileSize * this.screenHeight)/2;

		for(let i = 0; i < this.screenWidth * this.screenHeight; i++) {
			this.views[i] = hmUI.createWidget(hmUI.widget.FILL_RECT, {
				x: ox + tileSize * (i % this.screenWidth),
				y: oy + tileSize * Math.floor(i / this.screenWidth),
				w: tileSize,
				h: tileSize,
				color: 0x0
			});
		}
	}

	render(data) {
		for(let i = 0; i < this.screenWidth * this.screenHeight; i++) {
			let x = i % this.screenWidth;
			let y = Math.floor(i / this.screenWidth);
			let v = data[y * this.screenWidth + x];

			if(v === this.lastData[y * this.screenWidth + x]) continue;

			this.views[i].setProperty(hmUI.prop.MORE, {
				color: (v << 16) + (v << 8) + v
			});
		}

		this.lastData.set(data);
	}
}
