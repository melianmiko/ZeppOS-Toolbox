function mkImgArray(dir, count=10) {
	const out = [];
	for(let i = 0; i < count; i++)
		out.push(`${dir}/${i}.png`);
	return out;
}
