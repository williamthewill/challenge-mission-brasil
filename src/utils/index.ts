import { readdirSync } from 'fs'

/**
  * Imports all .js files under a directory and
  * returns an array of the imported modules
  */
export async function importDir<T = any>(dir: string): Promise<T[]> {
	const modules = []
	for (const filename of readdirSync(dir)) {
		if (filename.match(/\.js$/) !== null && filename !== 'index.js') {
			const path = './' + filename.replace('.js', '')
			const module = await import(dir + path)
			console.log(`Imported ${path} dynamically`)
			modules.push(module)
		}
	}
	return modules
}


export function mountUrl(host: string, path: string, params: { [key: string]: any }): string {
	const paramsStringfy = Object.keys(params).reduce((prev, curr) => {
		return `${prev}${curr}=${params[curr]}&`
	}, '')
	return `${host}/${path}?${paramsStringfy}`
}