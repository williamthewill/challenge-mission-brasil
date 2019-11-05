import { Router } from 'express'
import * as handler from '#handlers'

export function register(router: Router) {
	router.route('/images/zip')
		.get(handler.getImagesZip)
}
