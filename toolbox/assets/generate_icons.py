from PIL import Image, ImageDraw
from pathlib import Path
from cairosvg import svg2png
import io
import requests
import os
import subprocess

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
	'wake_on_wrist.png': 'nest_wake_on_press',
	"remman.png": "sync",
}

MENU_ICONS = {
	"apps.png": ("apps", "#FFFFFF"),
	"cb_false.png": ("check_box_outline_blank", "#999999"),
	"cb_true.png": ("check_box", "#FFFFFF"),
	"context.png": ("menu", "#999999"),
	"copy.png": ("file_copy", "#FFFFFF"),
	"cut.png": ("cut", "#FFFFFF"),
	"delete.png": ("delete", "#ff8888"),
	"expand.png": ("expand_more", "#FFFFFF"),
	"file_base.png": ("draft", "#FFFFFF"),
	"file_txt.png": ("description", "#0099FF"),
	"file_png.png": ("image", "#e91e63"),
	"files.png": ("folder", "#FFFFFF"),
	"remman.png": ("sync", "#FFFFFF"),
	"info.png": ("info", "#FFFFFF"),
	"lang.png": ("language", "#FFFFFF"),
	"font_size.png": ("format_size", "#FFFFFF"),
	"paste.png": ("content_paste", "#FFFFFF"),
	"play.png": ("play_arrow", "#FFFFFF"),
	"settings_misc.png": ("settings_applications", "#FFFFFF"),
	"storage.png": ("storage", "#FFFFFF"),
	"timer.png": ("timer", "#FFFFFF"),
	"ui.png": ("tune", "#FFFFFF"),
}

def main():
	# build_qs("common/qs", 92, 56)
	build_menu("common/menu_24", 24)
	build_menu("common/menu_32", 32)


def get_material_symbol(name, size):
	url = f"{MUI_ICONS_BASE_URL}/{name}/materialsymbolsoutlined/{name}_48px.svg"
	r = requests.get(url)
	with open("temp.svg", "wb") as f:
		f.write(r.content)
	subprocess.Popen(["inkscape", f"--export-width={size}",
								  f"--export-type=png",
								  f"--export-background-opacity=0"
								  f"--export-filename=temp.png",
								  "temp.svg"]).wait()
	img = Image.open("temp.png")
	os.remove("temp.svg")
	os.remove("temp.png")
	return img


def build_menu(target, out_size):
	out_dir = Path(target)
	out_dir.mkdir(exist_ok=True)
	for filename in MENU_ICONS:
		print(f"Processing {filename} for {target}")
		icon_name, color = MENU_ICONS[filename]
		mask = get_material_symbol(icon_name, out_size)
		icon = colorize(mask, color)
		icon.save(out_dir / filename)


def build_qs(target, out_size, in_size):
	out_dir = Path(target)
	for filename in QS_ICONS:
		if filename.endswith("_on.png"):
			color = "#000000"
			bg = "#CCCCCC"
		else:
			color = "#FFFFFF"
			bg = "#111111"

		print(f"Processing {filename}")
		mask = get_material_symbol(QS_ICONS[filename], in_size)
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

