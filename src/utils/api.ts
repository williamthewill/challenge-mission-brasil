import * as t from 'io-ts'
import * as e from 'express'
import { oneOf } from '#utils/types'

interface Input extends Record<string, InputValue> { }
type InputValue = t.PartialType<any> | t.Any | Input

// transformed output
type Output<I> = I extends t.Any ? I : OutputInterface<OutputProps<any>>
type OutputProps<I> = { [K in keyof I]: Output<I[K]> }
type OutputInterface<Props extends t.AnyProps> = t.InterfaceType<
	Props,
	t.TypeOfProps<Props>,
	t.OutputOfProps<Props>,
	t.mixed
>

type TypedRequest<Body, Params, Query> = {
	body: Body
	params: Params
	query: Query
}

type TypedResponse<Resp> = {
	status(statusCode: 200 | 300 | 400 | 500): TypedResponse<Resp>
	json(response: Resp): void
	attachment(response: Resp): TypedResponse<Resp>
	sendFile(response: Resp): void
}

type Handler<Body, Params, Query, Resp> =
	(req: TypedRequest<Body, Params, Query>, res: TypedResponse<Resp>, next: e.NextFunction) => Promise<void>

export function createInterface<I extends Input>(o: I): Output<I> {
	const interfaceRt = {} as any
	for (let [key, value] of Object.entries(o)) {
		if (!isRuntimeType(value)) {
			value = createInterface(value)
		}
		interfaceRt[key] = value
	}
	return t.interface(interfaceRt) as Output<I>
}

const isRuntimeType = (obj: any): obj is t.Type<any> =>
	obj instanceof t.Type

export function makeResponse<T extends Input, E extends string>(success: T, ...errors: E[]) {
	const successT = createInterface({ ...success, ok: t.literal(true) })
	const errorT = t.type({
		ok: t.literal(false),
		error: oneOf(...errors)
	})

	return t.taggedUnion('ok', [successT, errorT])
}

export function makeHandler<
	Body extends Input,
	Params extends Input,
	Query extends Input,
	Resp extends t.Type<any>
>(
	schema: { body?: Body, params?: Params, query?: Query, response?: Resp },
	handler: Handler<Output<Body>['_A'], Output<Params>['_A'], Output<Query>['_A'], Resp['_A']>,
	dynamicSchema: Partial<Record<'body' | 'params' | 'query', (req: e.Request) => Promise<Input>>> = {}
): e.RequestHandler {
	const validators: any = { static: {}, dynamic: {} }

	delete schema.response

	const staticSchemaKeys = Object.keys(schema)
	const dynamicSchemaKeys = Object.keys(dynamicSchema as any)
	for (const key of staticSchemaKeys) {
		validators['static'][key] = createInterface((schema as any)[key])
	}

	return async function (req: any, res, next) {
		for (const key of dynamicSchemaKeys) {
			const validator = await (dynamicSchema as any)[key](req)
			validators['dynamic'][key] = createInterface((validator as any))
		}
		for (const field of ['body', 'params', 'query']) {
			for (const key of ['static', 'dynamic']) {
				const result = validators[key][field] && validators[key][field].decode(req[field])
				if (result && result.isLeft()) {
					const errors = prettifyErrors(result.value)
					res.status(400).json({ ok: false, error: 'InvalidInput', debugInfo: errors })
					return
				} else {
					console.log(`req.${key} validated successfully`)
				}
			}
		}

		await handler(req, res, next)
	}
}

function prettifyErrors(errors: t.Errors): string[] {
	return errors.map(e => getMessage(e.value, e.context))
}

function getMessage(v: any, context: t.Context) {
	return `Invalid value ${stringify(v)} supplied to ${getContextPath(context)}`
}

function stringify(v: any): string {
	return typeof v === 'function' ? t.getFunctionName(v) : JSON.stringify(v)

}
function getContextPath(context: t.Context) {
	const keys = [] as string[]
	for (const { key, type } of context) {
		if (key === '') continue
		keys.push(key)
	}
	console.log('getting path')
	const lastType = context[context.length - 1].type.name
	console.log('got it')
	return `key '${keys.join('.')}' of type ${lastType}`
}
