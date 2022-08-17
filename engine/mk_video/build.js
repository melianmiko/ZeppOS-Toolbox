/*
    A simple Javascript program that converts Bad Apple into a Javascript program that plays Bad Apple in the console.

    Requires: ffmpeg (binary), glob (node), pngjs (node)
*/

const FPS = 1;
const WIDTH = 24;
const HEIGHT = 16;

const os = require("os");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const stream = require("stream");
const PNG = require("pngjs").PNG;
const glob = require("glob");

const VIDEO = "res/video.mp4"; // input

// preliminary checks + utility functions

if (!["Linux", "Darwin"].includes(os.type())) {
    throw new Error("file must be run in a unix-based shell");
}

function _execSync(cmd) {
    return child_process.execSync(cmd, { encoding: "utf8" }).trim();
}

function _execSyncSilent(cmd) {
    child_process.execSync(cmd, { stdio: "ignore" });
}

function mkdirIfNeeded(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function hasFfmpeg() {
    return Boolean(_execSync("which ffmpeg"));
}

if (!hasFfmpeg()) {
    throw new Error("ffmpeg must be installed");
}

mkdirIfNeeded("tmp");

// calculate video dimensions

function getVideoDims(path) {
    let [w, h] = _execSync(
        `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${path}`
    ).split("x");
    return {
        width: Number.parseInt(w),
        height: Number.parseInt(h),
    };
}

let idims = getVideoDims(VIDEO);

let newDims = {
    width: WIDTH,
    height: HEIGHT,
};

// ffmpeg requires that width and height be divisble by 2
newDims.width -= newDims.width % 2;
newDims.height -= newDims.height % 2;

const SCALED_VIDEO = "tmp/_video.mp4";

let a = _execSync(
    `ffmpeg -y -i ${VIDEO} -vf scale=${newDims.width}:${newDims.height} ${SCALED_VIDEO}`
);

function extractFrames(path, fps) {
    _execSync(`ffmpeg -i ${path} -vf fps=${fps} tmp/out%d.png`);
}

extractFrames(SCALED_VIDEO, FPS);
console.log("done.");

// scan for frame files and order them

let frameFiles = glob.sync("tmp/out*");
// sort frame files by frame number
frameFiles.sort((a, b) => {
    let frameNo = /\d+/g;
    let frameA = Number.parseInt(a.match(frameNo));
    let frameB = Number.parseInt(b.match(frameNo));

    return frameA - frameB;
});
console.log(frameFiles);
let frames = [];
let rawFrameData = new Uint8Array(WIDTH * HEIGHT * frameFiles.length);

for (let i = 0; i < frameFiles.length; i++) {
    console.log("processing frame", i);
    let imgData = PNG.sync.read(fs.readFileSync(frameFiles[i]));

    for (let y = 0; y < imgData.height; y++) {
        for (let x = 0; x < imgData.width; x++) {
            let idx = (imgData.width * y + x) << 2;
            let v = imgData.data[idx];
            let fdi = (WIDTH * HEIGHT * i) + (imgData.width * y) + x;

            rawFrameData[fdi] = v;
        }
    }
}

fs.writeFileSync('../assets/frames.dat', Buffer.from(rawFrameData.buffer));
