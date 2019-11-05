import { IncomingMessage, ServerResponse } from 'http'
import express, { json } from 'express'

// App routes

type RequestListener = (req: IncomingMessage, res: ServerResponse) => void
export async function setupListener(): Promise<RequestListener> {
	// Setup express
	const app = express()

	// Parse application/json into req.body
	app.use(json())

	/* IMPORTANT: This should be the last registered middleware */
	const { default: router, setupRouter } = await import('../routes')
	await setupRouter()
	console.log(`Router setup successfully`)
	app.use(router)

	return app
}
