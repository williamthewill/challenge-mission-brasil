import * as t from 'io-ts'
export function oneOf<S extends string>(...literals: S[]): t.KeyofType<{ [K in S]: null }> {
	const keyof: { [K in S]: null } = {} as any
	for (const lit of literals) {
		keyof[lit] = null
	}
	return t.keyof(keyof)
}

export const IntegerFromString = new t.Type<number, string>(
	'IntegerFromString',
	(m): m is number => typeof m === 'number',
	(m, c) => t.string.decode(m).chain(s => t.Integer.decode(Number(s))),
	a => a.toString()
)
