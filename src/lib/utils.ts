class Is {
    array(value: any): boolean {
        return Array.isArray(value)
    }

    object(value: any): boolean {
        return typeof value === 'object' && !this.array(value)
    }

    number(value: any): boolean {
        return typeof value === 'number'
    }

    string(value: any): boolean {
        return typeof value === 'string'
    }

    boolean(value: any): boolean {
        return typeof value === 'boolean'
    }

    null(value: any): boolean {
        return value === null
    }

    last(value: Record<string, any> | Array<any>, current: string | number): boolean {
        return (this.array(value) ? (value.length - 1) : Object.keys(value).pop()) === current
    }

    scalar(value: any): boolean {
        return this.number(value) || this.string(value) || this.boolean(value) || this.null(value)
    }
}

export const is = new Is


class Checker {
    private value: any


    constructor(value: any) {
        this.value = is.string(value) ? value.toLowerCase() : value

    }

    startsWith(query: string): boolean {
        const q = this.normalizeQuery(query)

        if (is.array(this.value)) {
            return this.value.filter(item => checkIf(item).startsWith(query)).length !== 0
        }

        if (
            (is.number(this.value) || is.string(this.value))
            && (is.number(q) || is.string(q))
        ) {
            return String(this.value).startsWith(`${q}`)
        }

        return false
    }

    contains(query: string): boolean {
        const q = this.normalizeQuery(query)

        if (is.array(this.value)) {
            return this.value.filter(item => checkIf(item).contains(query)).length !== 0
        }

        if (
            (is.number(this.value) || is.string(this.value))
            && (is.number(q) || is.string(q))
        ) {
            return new String(this.value).includes(`${q}`)
        }

        return false
    }

    endsWith(query: string): boolean {
        const q = this.normalizeQuery(query)

        if (is.array(this.value)) {
            return this.value.filter(item => checkIf(item).endsWith(query)).length !== 0
        }

        if (
            (is.number(this.value) || is.string(this.value))
            && (is.number(q) || is.string(q))
        ) {
            return new String(this.value).endsWith(`${q}`)
        }

        return false
    }

    equals(query: string): boolean {
        const q = this.normalizeQuery(query)

        if (is.array(this.value)) {
            return this.value.filter(item => checkIf(item).equals(query)).length !== 0
        }

        if (
            (is.number(this.value) || is.string(this.value) || is.boolean(this.value))
            && (is.number(q) || is.string(q) || is.boolean(q))
        ) {
            return this.value === q
        }

        return is.null(this.value) && is.null(q)
    }

    private normalizeQuery(query: string): string | number | boolean | null {
        if ((query.startsWith('"') || query.startsWith("'")) && query.endsWith(query[0])) {
            return query.slice(1, -1).toLowerCase()
        }
        if (query === parseInt(query).toString()) return parseInt(query)
        if (query === parseFloat(query).toString()) return parseFloat(query)
        if (query === 'TRUE') return true
        if (query === 'FALSE') return false

        return null
    }
}

function checkIf(value: any) {
    return new Checker(value)
}


enum FilterTokenType {
    ArrayAll,
    ArrayAt,
    Property,
    CheckFromStart,
    CheckContains,
    CheckAtEnd,
    CheckExactly,

}

type FilterToken = {
    type: FilterTokenType,
    length: number,
    data: string | number | null
}

export const FilterNoneFound = Symbol('none found')
export const FilterError = Symbol('error')

class FilterProcessor {
    process(str: string, value: any): any {
        if (str === '') {
            return value
        }

        const tokens = this.tokenize(str)

        if (str.length !== tokens.reduce((care: number, token: FilterToken) => care + token.length, 0)) {
            return FilterError
        }

        let atAll: boolean = false

        for (const token of tokens) {
            switch (token.type) {
                case FilterTokenType.ArrayAll:
                    break
                case FilterTokenType.ArrayAt:
                    value = this.extract(value, v => v.at(token.data), atAll)
                    break
                case FilterTokenType.Property:
                    value = this.extract(value, v => v[token.data], atAll)
                    break
                case FilterTokenType.CheckFromStart:
                    value = this.extract(value, v => checkIf(v).startsWith(token.data) ? v : undefined, atAll)
                    break
                case FilterTokenType.CheckContains:
                    value = this.extract(value, v => checkIf(v).contains(token.data) ? v : undefined, atAll)
                    break
                case FilterTokenType.CheckAtEnd:
                    value = this.extract(value, v => checkIf(v).endsWith(token.data) ? v : undefined, atAll)
                    break
                case FilterTokenType.CheckExactly:
                    value = this.extract(value, v => checkIf(v).equals(token.data) ? v : undefined, atAll)
                    break
            }

            atAll = token.type === FilterTokenType.ArrayAll
        }

        return this.sanitizeOutput(value)
    }

    private tokenize(str: string): FilterToken[] {
        const tokens: FilterToken[] = []
        let token: FilterToken | null = null

        while (token = this.nextToken(str)) {
            tokens.push(token)
            str = str.slice(token.length)
        }

        return tokens
    }

    private nextToken(str: string): FilterToken | null {
        if (str === '') return null

        const arrayAll = str.match(/^\[\]/)?.at(0)
        if (arrayAll) {
            return {
                type: FilterTokenType.ArrayAll,
                length: arrayAll.length,
                data: null,
            }
        }

        const arrayAt = str.match(/^\[(\d+)\]/)?.at(1)
        if (arrayAt) {
            return {
                type: FilterTokenType.ArrayAt,
                length: arrayAt.length + 2,
                data: parseInt(arrayAt),
            }
        }

        const property = str.match(/^(\.?\w+)/)?.at(0)
        if (property) {
            return {
                type: FilterTokenType.Property,
                length: property.length,
                data: property.startsWith('.') ? property.slice(1) : property,
            }
        }

        const search = str.match(/^\((?<type>[\^\*\$\=])\s*(?<query>[^)]+)\s*\)/)

        if (search) {
            const length = search.at(0)?.length ?? 0
            const data = search.groups?.query ?? null

            switch (search.groups?.type) {
                case '^': return {
                    type: FilterTokenType.CheckFromStart,
                    length,
                    data,
                }
                case '*': return {
                    type: FilterTokenType.CheckContains,
                    length,
                    data,
                }
                case '$': return {
                    type: FilterTokenType.CheckAtEnd,
                    length,
                    data,
                }
                case '=': return {
                    type: FilterTokenType.CheckExactly,
                    length,
                    data,
                }
            }
        }

        return null
    }

    private extract(value: any, callback: (v: any) => any, atAll: boolean) {
        return atAll
            ? value.map(callback)
            : callback(value)
    }

    private sanitizeOutput(value: any): any {
        if (is.array(value)) {
            value = value.filter(item => this.sanitizeOutput(item) !== FilterNoneFound)
            value = value.length !== 0 ? value : FilterNoneFound
        }

        return value === undefined ? FilterNoneFound : value
    }
}

export const filterProcessor = new FilterProcessor
