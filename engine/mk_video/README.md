# bad-apple.js

A Javascript implementation of the famous music video for the song featured in *Touhou*

![Screenshot2](https://github.com/iahuang/bad-apple/raw/main/res/sc.png)

## Usage

To compile a version of the playback script configured for your current terminal size, run
```
npm install
node build.js
```
Keep in mind that you will need to have a copy of `ffmpeg` installed on your computer beforehand. Additionally, the build script will only run on Unix-based shell environments such as `bash` on Mac, Linux, or WSL.

Alternatively, run the prebuilt script located at `dist/ba.js`, which has been configured for a 40x30 character terminal.