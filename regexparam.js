/**
 * @overload
 * @param {string} input The route pattern
 * @param {boolean} [loose] Allow open-ended matching
 * @returns {{ keys: string[], pattern: RegExp }}
 */
/**
 * @overload
 * @param {RegExp} input The route pattern
 * @returns {{ keys: false, pattern: RegExp }}
 */
/**
 * @param {string|RegExp} input The route pattern
 * @param {boolean} [loose] Allow open-ended matching. Ignored with `RegExp` input.
 * @returns {{ keys: string[] | false, pattern: RegExp }}
 */
export function parse(input, loose) {
    if (input instanceof RegExp) return { keys: false, pattern: input }
    let c,
        o,
        tmp,
        ext,
        pattern = ''
    const keys = [],
        arr = input.split('/')
    arr[0] || arr.shift()
    while ((tmp = arr.shift())) {
        c = tmp[0]
        if (c === '*') {
            keys.push(c)
            pattern += tmp[1] === '?' ? '(?:/(.*))?' : '/(.*)'
        } else if (c === ':') {
            o = tmp.indexOf('?', 1)
            ext = tmp.indexOf('.', 1)
            let end
            if (!!~o) end = o
            else if (!!~ext) end = ext
            else end = tmp.length
            keys.push(tmp.substring(1, end))
            pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)'
            if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext)
        } else {
            pattern += '/' + tmp
        }
    }
    return {
        keys: keys,
        pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i'),
    }
}

const RGX = /(\/|^)([:*][^/]*?)(\?)?(?=[/.]|$)/g

/**
 * @template {string} T
 * @param {T} route The route pattern
 * @param {Record<string, string>} values The values to inject
 * @returns {string}
 */
export function inject(route, values) {
    return route.replace(RGX, (x, lead, key, optional) => {
        x = values[key == '*' ? key : key.substring(1)]
        if (x) return '/' + x
        return optional || key == '*' ? '' : '/' + key
    })
}
