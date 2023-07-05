from pathlib import Path
import json
import shutil
import os

project = Path(".").resolve()
common_assets = project / "assets" / "common"

pages = [
  "MainScreen",
  "RemoteManScreen",
  "AboutScreen",
  "AppEditScreen",
  "AppListScreen",
  "FileEditScreen",
  "FileManagerScreen",
  "HexdumpScreen",
  "ImageViewScreen",
  "RebootConfirmScreen",
  "SettingsHomePage",
  "SettingsLangScreen",
  "SettingsMiscPage",
  "SettingsFontSize",
  "SettingsUiScreen",
  "StorageInfoScreen",
  "TextViewScreen",
  "TimerOutScreen",
  "TimerSetScreen",
  "ToggleDanger",
]

module = {
  "app-side": {
    "path": "app-side/index"
  }
}

targets = {
  "band-7": 24,
  "dialog": 32,
  "nxp": 32,
  "mhs": 32,
}

with open("app.json", "r") as f:
  app_json = json.load(f)


# Prepare assets
for target_id in targets:
  icon_size = targets[target_id]
  assets_dir = project / "assets" / target_id
  if assets_dir.is_dir():
    shutil.rmtree(assets_dir)
  assets_dir.mkdir()

  # Misc files
  shutil.copy(common_assets / "icon.png", assets_dir)
  shutil.copy(common_assets / "i_next.png", assets_dir)
  shutil.copy(common_assets / "brightness.png", assets_dir)
  shutil.copy(common_assets / "battery.png", assets_dir)
  shutil.copytree(common_assets / "edit", assets_dir / "edit")
  shutil.copytree(common_assets / "files", assets_dir / "files")
  shutil.copytree(common_assets / "qs", assets_dir / "qs")
  if target_id == "band-7":
    shutil.copytree(common_assets / "timer", assets_dir / "timer")
  shutil.copytree(common_assets / f"menu_{icon_size}", assets_dir / "menu")

  # App.json
  app_json["targets"][target_id]["module"] = {
    "page": {
      "pages": [f"page/{i}" for i in pages]
    },
    **module
  }

with open("app.json", "w") as f:
  f.write(json.dumps(app_json, indent=2))
