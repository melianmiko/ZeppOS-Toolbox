from pathlib import Path

import json
import subprocess
import os
import sys
import shutil

VARIANTS_ROOT = Path().resolve()
DATA_ROOT = VARIANTS_ROOT.parent
BUILD_ROOT = VARIANTS_ROOT / "build"
DIST_ROOT = VARIANTS_ROOT / "dist"

if DIST_ROOT.exists():
	shutil.rmtree(DIST_ROOT)
if BUILD_ROOT.exists():
	shutil.rmtree(BUILD_ROOT)
DIST_ROOT.mkdir()

with (DATA_ROOT / "app.json").open("r") as f:
	appConf = json.loads(f.read())

for fn in VARIANTS_ROOT.rglob("*.png"):
	appName = fn.name.split(".")[0]
	appConf["app"]['appName'] = appName
	appConf["app"]["appId"] += 1

	if BUILD_ROOT.exists():
		shutil.rmtree(BUILD_ROOT)
	BUILD_ROOT.mkdir()

	shutil.copytree(DATA_ROOT / "page", BUILD_ROOT / "page")
	shutil.copytree(DATA_ROOT / "utils", BUILD_ROOT / "utils")
	shutil.copytree(DATA_ROOT / "assets", BUILD_ROOT / "assets")
	shutil.copy(VARIANTS_ROOT / fn, BUILD_ROOT / "assets/icon.png")
	with (BUILD_ROOT / "app.json").open("w") as f:
		f.write(json.dumps(appConf, ensure_ascii=False))

	subprocess.Popen(["bash", "-c", f"zmake {BUILD_ROOT}"]).wait()
	shutil.copy(BUILD_ROOT / "dist/build.bin", DIST_ROOT / f"{appName}.bin")
