import * as e from 'express'

type TestReq = {
	body?: object
	params?: object
	query?: object
}

type ResponseResult = {
	code: number
	response: object
}

class Response {
	private code!: number
	private response!: object

	constructor() {}

	status(code: number) {
		this.code = code
		return this
	}

	json(body: object) {
		this.response = body
	}

	result(): ResponseResult {
		if (!this.code || !this.response) {
			throw new Error('Code or response not set!')
		}

		return {
			code: this.code,
			response: this.response
		}
	}
}

const empty = () => {}

export const testHandler = async (handler: e.RequestHandler, req: TestReq) => {
	const res = new Response()
	await handler(req as any, res as any, empty)
	return res.result()
}
