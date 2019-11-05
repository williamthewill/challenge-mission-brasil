import { readFileSync, createWriteStream, mkdirSync, existsSync, createReadStream, WriteStream } from 'fs'
import { makeHandler } from '#utils/api'
import { get } from 'https'
import archiver from 'archiver'

async function zipFolder(dirFiles: string, output: WriteStream) {
	const archive = archiver('zip', {
		zlib: { level: 9 } // Sets the compression level.
	})

	archive.on('warning', function (err) {
		if (err.code === 'ENOENT') {
			console.log(err)
		} else {
			throw err
		}
	})

	archive.on('error', function (err) {
		throw err
	})


	archive.pipe(output)
	archive.glob(dirFiles)

	return archive.finalize()
}


async function downloadFile(dest: string, url: string): Promise<boolean> {
	const file = createWriteStream(dest)
	return new Promise(resolve => {
		get(url, function (response) {
			response.pipe(file)
			file.on('finish', function () {
				file.close()
				resolve(true)
			})
		})
	})
}

export const getImagesZip = makeHandler({}, async (req, res) => {
	const imagesPath = process.env.FILES
	if (!imagesPath) return

	const { images } = JSON.parse(readFileSync(imagesPath).toString()) as { images: Array<string> }

	if (!images) return

	const dir = './images'

	if (!existsSync(dir)) {
		mkdirSync(dir)
	}

	await Promise.all(images.map((imageUrl, index) => {
		return downloadFile(`${dir}/photo_${index + 1}.png`, imageUrl)
	}))

	const output = createWriteStream('images.zip')

	output.on('close', function () {
		console.log('archiver has been finalized and the output file descriptor has closed.')
		res.sendFile(`${__dirname.replace("/dist/src/handlers", "")}/images.zip`)
	})

	output.on('end', function () {
		console.log('Data has been drained')
	})

	await zipFolder('images/*.png', output)
})
