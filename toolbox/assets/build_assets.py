from PIL import Image, ImageDraw
from pathlib import Path
from cairosvg import svg2png
import io

# import requests

MUI_ICONS_BASE_URL = "https://github.com/google/material-design-icons/raw/master/symbols/web"

QS_ICONS = {
	'aod.png': 'aod', 
	'aod_on.png': 'aod', 
	'applistsort.png': 'sort', 
	'apps.png': 'app_registration', 
	'brightness_btn.png': 'brightness_6', 
	'camera.png': 'camera', 
	'dnd.png': 'do_not_disturb_off', 
	'dnd_on.png': 'do_not_disturb_on', 
	'files.png': 'folder', 
	'flashlight.png': 'flashlight_on', 
	'poweroff.png': 'power_settings_new', 
	'powersave.png': 'battery_saver', 
	'reboot.png': 'refresh', 
	'settings.png': 'settings', 
	'storage.png': 'storage', 
	'system.png': 'memory', 
	'timer.png': 'timer', 
	'wake_on_wrist.png': 'nest_wake_on_press'
}

def main():
	build_qs("mi-band-7", 92)


def get_material_symbol(name, size):
	url = f"{MUI_ICONS_BASE_URL}/{name}/materialsymbolsoutlined/{name}_48px.svg"
	png_bytes = svg2png(url=url, scale=size / 48)
	img = Image.open(io.BytesIO(png_bytes))
	return img


def build_qs(target, out_size):
	out_dir = Path(f"{target}/qs")
	for filename in QS_ICONS:
		if filename.endswith("_on.png"):
			color = "#000000"
			bg = "#CCCCCC"
		else:
			color = "#FFFFFF"
			bg = "#111111"

		print(f"Processing {filename}")
		mask = get_material_symbol(QS_ICONS[filename], 56)
		icon = colorize(mask, color)

		tile = Image.new("RGBA", (out_size, out_size))
		draw = ImageDraw.Draw(tile)
		draw.ellipse((1, 1, out_size-1, out_size-1), fill=bg)

		offset = round( (out_size - icon.size[0]) / 2 )
		tile.alpha_composite(icon, (offset, offset))
		tile.save(out_dir / filename)

# ------------------------------------------------------------

def spawn_color_image(size: tuple[int, int], color: str):
    return Image.new("RGBA", size, color=color)


def colorize(mask: Image.Image, color: str):
    fg = Image.new("RGBA", mask.size, color=color)

    mask = mask.convert("RGBA")
    mask_data = mask.getdata()
    fg_data = fg.getdata()

    img_data = list()
    for a, mask_pixel in enumerate(mask_data):
        img_data.append((fg_data[a][0],
                         fg_data[a][1],
                         fg_data[a][2],
                         round(fg_data[a][3] / 255 * mask_pixel[3])))

    # noinspection PyTypeChecker
    fg.putdata(img_data)

    return fg


main()

