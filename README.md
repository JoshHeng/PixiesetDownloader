# Pixieset Downloader
Node.js app to download all the images from a Pixieset site.

## Running Downloader
1. Run `npm install`
2. Copy `.env.example` to `.env` and fill in the respective fields
3. Run `npm start`

## Environment Variables
| Name | Description | Example |
| ---- | ----------- | ------- |
| `ALBUMS` | A comma-separated list of the albums you would like to download. Can be found as the last URL path or in the menu. | highlights, secondalbum |
| `EXAMPLE_GET_URL` | One of the GET XHR urls used to fetch images. Find this in the inspector 'Network' tab by filtering to XHR requests and refreshing the page | https://author.pixieset.com/client/loadphotos/?cuk=customerid&cid=id&gs=album&fk=&page=2 |
| `PHPSESSID_COOKIE` | The `PHPSESSID` cookie. Find this in the inspector 'Storage' tab. | asdhuisdiuhasd |