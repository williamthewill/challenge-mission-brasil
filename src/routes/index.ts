import { Request, Response, NextFunction } from 'express'
const Router = require('express-promise-router') // tslint:disable-line:no-var-requires
import { importDir } from '#utils'

export async function setupRouter() {
	const routes = await importDir(__dirname + '/')
	for (const { register } of routes) {
		register(router)
	}

	console.log(`Registered ${routes.length} routes`)

	function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
		console.error(err)
		res.status(500).end()
	}

	router.use(errorHandler)
}

const router = Router()
export default router
