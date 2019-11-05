import * as t from 'io-ts'
import { PathReporter } from 'io-ts/lib/PathReporter'
import { IntegerFromString, oneOf } from '#utils/types'

const schema = t.interface({
	PORT: IntegerFromString,
	NODE_ENV: oneOf('development', 'test', 'production')
})

export let config: typeof schema['_A']

export function initConfig<T extends t.InterfaceType<any>>() {
	const result = schema.decode(process.env)
	if (result.isRight()) {
		config = result.value
	} else {
		console.error(PathReporter.report(result))
		console.error('Some environment variables are not set. See error message above.')
		process.exit(1)
	}
}

