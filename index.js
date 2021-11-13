require('dotenv').config();
const axios = require('axios');
const path = require('path');
const fs = require('fs');

if (!process.env.EXAMPLE_GET_URL) return console.error('Please provide an example GET url');
const exampleGetUrl = new URL(process.env.EXAMPLE_GET_URL);
if (!exampleGetUrl.searchParams.get('cuk') || !exampleGetUrl.searchParams.get('cid')) return console.error('Invalid GET url');
if (!process.env.PHPSESSID_COOKIE) return console.error('Please add PHPSESSID cookie');

/**
 * Get an album
 * @param {String} albumName 
 */
async function getAlbum(albumName) {
	console.log(`Fetching ${albumName}`);

	const response = await axios.get(`https://${exampleGetUrl.host}/client/loadphotos/?cuk=${exampleGetUrl.searchParams.get('cuk')}&gs=${albumName}&page=1&cid=${exampleGetUrl.searchParams.get('cid')}&all=1`, {
		headers: { 'X-Requested-With': 'XMLHttpRequest', 'Cookie': `PHPSESSID=${process.env.PHPSESSID_COOKIE}` }
	});
	if (!response.data || response.data.status === 'error' || !response.data.content) {
		console.error(response.status);
		console.error(response.data);
		return console.error('An error occured. Please update the GET url');
	}
	if (!response.data.isLastPage) console.error('WARNING: More images in this album that were not fetched');
	
	const content = JSON.parse(response.data.content);
	console.log(`Found ${content.length} images`);

	return content;
}

/**
 * Download an album's images
 * @param {Object} images
 */
async function downloadAlbum(albumName, images) {
	console.log(`Downloading ${images.length} images`);

	const savePath = path.resolve(__dirname, 'images', albumName);
	fs.mkdirSync(savePath, { recursive: true });

	for (const image of images) {
		console.log(` - Downloading ${image.name} (${image.pathXxlarge})`);

		const response = await axios.get(`https:${image.pathXxlarge}`, { responseType: 'stream' });

		const writer = fs.createWriteStream(path.resolve(savePath, image.name));
		response.data.pipe(writer);

		await new Promise((res, rej) => {
			writer.on('finish', res);
			writer.on('error', rej);
		});
	};

	console.log(`${images.length} images downloaded`);
}

/**
 * Main function
 */
async function main() {
	const album = await getAlbum('stgeorgeshallalbumii');
	await downloadAlbum('stgeorgeshallalbumii', album);

	console.log('Done!');
}

main();

