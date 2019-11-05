import * as http from 'http'
import { setupListener } from '#setup/express'

async function setupServer() {
	const app = await setupListener()
	return http.createServer(app)
}

export async function startServer(port: number) {
	const server = await setupServer()

	server.listen({
		host: '0.0.0.0',
		port,
	}, function () {
		console.log(`Server listening on port ${port}`)
	})

	return server
}
