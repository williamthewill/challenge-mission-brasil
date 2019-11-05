// Rewrite require paths so we're able to use absolute imports
// See the "requireRewrite" in package.json and "paths" in tsconfig.json
require('require-rewrite')(__dirname)

// Load environment variables
require('dotenv-safe').config()

// Add support for source maps
import 'source-map-support/register'

// Initialize config
import { config, initConfig } from '#setup/config'
initConfig()

import { startServer } from '#setup/server'

startServer(config.PORT).catch(err => {
	console.error('Error starting server')
	console.error(err)
})
