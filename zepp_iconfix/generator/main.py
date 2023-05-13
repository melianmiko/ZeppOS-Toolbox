import requests
import json
import shutil
from pathlib import Path
from zipfile import ZipFile
from PIL import Image

apps_dir = Path("apps")
dist_dir = Path("../assets")
overrides = {}

with open("catalog.json", "r") as f:
	catalog = json.load(f)

i = 0
for entry in catalog["data"]:
	print(f"{i}. Processing {entry['name']}")
	ident = entry["id"]
	out_dir = apps_dir / str(ident)
	if not out_dir.exists():
		out_dir.mkdir()
		icon = requests.get(entry["image"])
		with open(out_dir / "image.png", "wb") as f:
			f.write(icon.content)
		zpk = requests.get(entry["download_url"])
		with open(out_dir / "app.zpk", "wb") as f:
			f.write(zpk.content)

	with ZipFile(out_dir / "app.zpk", "r") as zpk:
		zpk.extract("device.zip", out_dir)
	with ZipFile(out_dir / "device.zip", "r") as device_zip:
		device_zip.extract("app.json", out_dir)

	with open(out_dir / "app.json", "r") as f:
		app_json = json.load(f)

	app_id = app_json["app"]["appId"]
	target_asset = app_json["app"]['icon']
	on_device_dir = hex(app_id)[2:].upper().zfill(8)
	w_path = f"/storage/js_apps/{on_device_dir}/assets/{target_asset}"
	s_path = f"{on_device_dir}.png"

	new_icon = Image.open(out_dir / "image.png")
	new_icon.thumbnail((100, 100))

	out_icon = Image.new("RGBA", (100,100), color="#000000")
	out_icon.alpha_composite(new_icon)
	out_icon.save(dist_dir / s_path)
	overrides[s_path] = w_path

	i += 1

with open("overrides.json", "w") as f:
	f.write(json.dumps(overrides, indent=4))
