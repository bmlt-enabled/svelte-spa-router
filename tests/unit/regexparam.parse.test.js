import { describe, it, expect } from 'vitest'
import { parse } from '../../regexparam.js'

const hasNamedGroups = 'groups' in /x/.exec('x')

function run(route, url, loose) {
    let i = 0
    const out = {},
        result = parse(route, !!loose)
    const matches = result.pattern.exec(url)
    if (matches === null) return false
    if (matches.groups) return matches.groups
    while (i < result.keys.length) {
        out[result.keys[i]] = matches[++i] || null
    }
    return out
}

function raw(route, url, loose) {
    return parse(route, !!loose).pattern.exec(url)
}

function toExec(route, url, params) {
    let out = run(route, url)
    if (out && params) out = { ...out }
    expect(out).toEqual(params)
}

function toLooseExec(route, url, params) {
    let out = run(route, url, true)
    if (out && params) out = { ...out }
    expect(out).toEqual(params)
}

describe('parse()', () => {
    it('exports', () => {
        expect(typeof parse).toBe('function')
    })

    it('returns :: string', () => {
        const output = parse('/')
        expect(typeof output).toBe('object')
        expect(output.pattern).toBeInstanceOf(RegExp)
        expect(output.keys).toBeInstanceOf(Array)
    })

    it('returns :: RegExp', () => {
        const pattern = /foobar/
        const output = parse(pattern)
        expect(typeof output).toBe('object')
        expect(output.pattern).toBe(pattern)
        expect(output.keys).toBe(false)
    })

    it('ensure lead slash', () => {
        expect(parse('/')).toEqual(parse(''))
        expect(parse('/books')).toEqual(parse('books'))
        expect(parse('/books/:title')).toEqual(parse('books/:title'))
        expect(parse('/books/:title?')).toEqual(parse('books/:title?'))
        expect(parse('/books/*')).toEqual(parse('books/*'))
    })

    it('static', () => {
        const { keys, pattern } = parse('/books')
        expect(keys).toEqual([])
        expect(pattern.test('/books')).toBe(true)
        expect(pattern.test('/books/')).toBe(true)
        expect(pattern.test('/books/author')).toBe(false)
        expect(pattern.test('books')).toBe(false)
    })

    it('static :: multiple', () => {
        const { keys, pattern } = parse('/foo/bar')
        expect(keys).toEqual([])
        expect(pattern.test('/foo/bar')).toBe(true)
        expect(pattern.test('/foo/bar/')).toBe(true)
        expect(pattern.test('/foo/bar/baz')).toBe(false)
        expect(pattern.test('foo/bar')).toBe(false)
    })

    it('param', () => {
        const { keys, pattern } = parse('/books/:title')
        expect(keys).toEqual(['title'])
        expect(pattern.test('/books')).toBe(false)
        expect(pattern.test('/books/')).toBe(false)
        expect(pattern.test('/books/narnia')).toBe(true)
        expect(pattern.test('/books/narnia/')).toBe(true)
        expect(pattern.test('/books/narnia/hello')).toBe(false)
        expect(pattern.test('books/narnia')).toBe(false)
        const [url, value] = pattern.exec('/books/narnia')
        expect(url).toBe('/books/narnia')
        expect(value).toBe('narnia')
    })

    it('param :: static :: none', () => {
        const { keys, pattern } = parse('/:title')
        expect(keys).toEqual(['title'])
        expect(pattern.test('/')).toBe(false)
        expect(pattern.test('/narnia')).toBe(true)
        expect(pattern.test('/narnia/')).toBe(true)
        expect(pattern.test('/narnia/reviews')).toBe(false)
        expect(pattern.test('narnia')).toBe(false)
        const [url, value] = pattern.exec('/narnia/')
        expect(url).toBe('/narnia/')
        expect(value).toBe('narnia')
    })

    it('param :: static :: multiple', () => {
        const { keys, pattern } = parse('/foo/bar/:title')
        expect(keys).toEqual(['title'])
        expect(pattern.test('/foo/bar')).toBe(false)
        expect(pattern.test('/foo/bar/')).toBe(false)
        expect(pattern.test('/foo/bar/narnia')).toBe(true)
        expect(pattern.test('/foo/bar/narnia/')).toBe(true)
        expect(pattern.test('/foo/bar/narnia/hello')).toBe(false)
        expect(pattern.test('foo/bar/narnia')).toBe(false)
        expect(pattern.test('/foo/narnia')).toBe(false)
        expect(pattern.test('/bar/narnia')).toBe(false)
        const [url, value] = pattern.exec('/foo/bar/narnia')
        expect(url).toBe('/foo/bar/narnia')
        expect(value).toBe('narnia')
    })

    it('param :: multiple', () => {
        const { keys, pattern } = parse('/books/:author/:title')
        expect(keys).toEqual(['author', 'title'])
        expect(pattern.test('/books')).toBe(false)
        expect(pattern.test('/books/')).toBe(false)
        expect(pattern.test('/books/smith')).toBe(false)
        expect(pattern.test('/books/smith/')).toBe(false)
        expect(pattern.test('/books/smith/narnia')).toBe(true)
        expect(pattern.test('/books/smith/narnia/')).toBe(true)
        expect(pattern.test('/books/smith/narnia/reviews')).toBe(false)
        expect(pattern.test('books/smith/narnia')).toBe(false)
        const [url, author, title] = pattern.exec('/books/smith/narnia')
        expect(url).toBe('/books/smith/narnia')
        expect(author).toBe('smith')
        expect(title).toBe('narnia')
    })

    it('param :: suffix', () => {
        const { keys, pattern } = parse('/movies/:title.mp4')
        expect(keys).toEqual(['title'])
        expect(pattern.test('/movies')).toBe(false)
        expect(pattern.test('/movies/')).toBe(false)
        expect(pattern.test('/movies/foo')).toBe(false)
        expect(pattern.test('/movies/foo.mp3')).toBe(false)
        expect(pattern.test('/movies/foo.mp4')).toBe(true)
        expect(pattern.test('/movies/foo.mp4/')).toBe(true)
    })

    it('param :: suffices', () => {
        const { keys, pattern } = parse('/movies/:title.(mp4|mov)')
        expect(keys).toEqual(['title'])
        expect(pattern.test('/movies')).toBe(false)
        expect(pattern.test('/movies/')).toBe(false)
        expect(pattern.test('/movies/foo')).toBe(false)
        expect(pattern.test('/movies/foo.mp3')).toBe(false)
        expect(pattern.test('/movies/foo.mp4')).toBe(true)
        expect(pattern.test('/movies/foo.mp4/')).toBe(true)
        expect(pattern.test('/movies/foo.mov')).toBe(true)
        expect(pattern.test('/movies/foo.mov/')).toBe(true)
    })

    it('param :: optional', () => {
        const { keys, pattern } = parse('/books/:author/:title?')
        expect(keys).toEqual(['author', 'title'])
        expect(pattern.test('/books')).toBe(false)
        expect(pattern.test('/books/')).toBe(false)
        expect(pattern.test('/books/smith')).toBe(true)
        expect(pattern.test('/books/smith/')).toBe(true)
        expect(pattern.test('/books/smith/narnia')).toBe(true)
        expect(pattern.test('/books/smith/narnia/')).toBe(true)
        expect(pattern.test('/books/smith/narnia/reviews')).toBe(false)
        expect(pattern.test('books/smith/narnia')).toBe(false)
        const [, author, title] = pattern.exec('/books/smith/narnia')
        expect(author).toBe('smith')
        expect(title).toBe('narnia')
    })

    it('param :: optional :: static :: none', () => {
        const { keys, pattern } = parse('/:title?')
        expect(keys).toEqual(['title'])
        expect(pattern.test('/')).toBe(true)
        expect(pattern.test('/narnia')).toBe(true)
        expect(pattern.test('/narnia/')).toBe(true)
        expect(pattern.test('/narnia/reviews')).toBe(false)
        expect(pattern.test('narnia')).toBe(false)
        const [, value] = pattern.exec('/narnia')
        expect(value).toBe('narnia')
    })

    it('param :: optional :: multiple', () => {
        const { keys, pattern } = parse('/books/:genre/:author?/:title?')
        expect(keys).toEqual(['genre', 'author', 'title'])
        expect(pattern.test('/books')).toBe(false)
        expect(pattern.test('/books/')).toBe(false)
        expect(pattern.test('/books/horror')).toBe(true)
        expect(pattern.test('/books/horror/')).toBe(true)
        expect(pattern.test('/books/horror/smith')).toBe(true)
        expect(pattern.test('/books/horror/smith/')).toBe(true)
        expect(pattern.test('/books/horror/smith/narnia')).toBe(true)
        expect(pattern.test('/books/horror/smith/narnia/')).toBe(true)
        expect(pattern.test('/books/horror/smith/narnia/reviews')).toBe(false)
        expect(pattern.test('books/horror/smith/narnia')).toBe(false)
        const [, genre, author, title] = pattern.exec(
            '/books/horror/smith/narnia',
        )
        expect(genre).toBe('horror')
        expect(author).toBe('smith')
        expect(title).toBe('narnia')
    })

    it('wildcard', () => {
        const { keys, pattern } = parse('/books/*')
        expect(keys).toEqual(['*'])
        expect(pattern.test('/books')).toBe(false)
        expect(pattern.test('/books/')).toBe(true)
        expect(pattern.test('/books/narnia')).toBe(true)
        expect(pattern.test('/books/narnia/')).toBe(true)
        expect(pattern.test('/books/narnia/reviews')).toBe(true)
        expect(pattern.test('books/narnia')).toBe(false)
        const [, value] = pattern.exec('/books/narnia/reviews')
        expect(value).toBe('narnia/reviews')
    })

    it('wildcard :: root', () => {
        const { keys, pattern } = parse('*')
        expect(keys).toEqual(['*'])
        expect(pattern.test('/')).toBe(true)
        expect(pattern.test('/narnia')).toBe(true)
        expect(pattern.test('/narnia/')).toBe(true)
        expect(pattern.test('/narnia/reviews')).toBe(true)
        expect(pattern.test('narnia')).toBe(false)
        const [, value] = pattern.exec('/foo/bar/baz')
        expect(value).toBe('foo/bar/baz')
    })

    it('optional wildcard', () => {
        const { keys, pattern } = parse('/books/*?')
        expect(keys).toEqual(['*'])
        expect(pattern.test('/books')).toBe(true)
        expect(pattern.test('/books/')).toBe(true)
        expect(pattern.test('/books/narnia')).toBe(true)
        expect(pattern.test('/books/narnia/')).toBe(true)
        expect(pattern.test('/books/narnia/reviews')).toBe(true)
        expect(pattern.test('books/narnia')).toBe(false)
        const [, value] = pattern.exec('/books/narnia/reviews')
        expect(value).toBe('narnia/reviews')
    })

    it('optional wildcard :: root', () => {
        const { keys, pattern } = parse('*?')
        expect(keys).toEqual(['*'])
        expect(pattern.test('/')).toBe(true)
        expect(pattern.test('/narnia')).toBe(true)
        expect(pattern.test('/narnia/')).toBe(true)
        expect(pattern.test('/narnia/reviews')).toBe(true)
        expect(pattern.test('narnia')).toBe(false)
        const [, value] = pattern.exec('/foo/bar/baz')
        expect(value).toBe('foo/bar/baz')
    })

    it('execs', () => {
        toExec('/books', '/', false)
        toExec('/books', '/books', {})
        toExec('/books', '/books/', {})
        toExec('/books', '/books/world/', false)
        toExec('/books', '/books/world', false)

        toExec('/:title', '/hello', { title: 'hello' })
        toExec('/:title', '/hello/', { title: 'hello' })
        toExec('/:title', '/hello/world/', false)
        toExec('/:title', '/hello/world', false)
        toExec('/:title', '/', false)

        toExec('/:title?', '/', { title: null })
        toExec('/:title?', '/hello', { title: 'hello' })
        toExec('/:title?', '/hello/', { title: 'hello' })
        toExec('/:title?', '/hello/world/', false)
        toExec('/:title?', '/hello/world', false)

        toExec('/:title.mp4', '/hello.mp4', { title: 'hello' })
        toExec('/:title.mp4', '/hello.mp4/', { title: 'hello' })
        toExec('/:title.mp4', '/hello.mp4/history/', false)
        toExec('/:title.mp4', '/hello.mp4/history', false)
        toExec('/:title.mp4', '/', false)

        toExec('/:title/:genre', '/hello/world', {
            title: 'hello',
            genre: 'world',
        })
        toExec('/:title/:genre', '/hello/world/', {
            title: 'hello',
            genre: 'world',
        })
        toExec('/:title/:genre', '/hello/world/mundo/', false)
        toExec('/:title/:genre', '/hello/world/mundo', false)
        toExec('/:title/:genre', '/hello/', false)
        toExec('/:title/:genre', '/hello', false)

        toExec('/:title/:genre?', '/hello', { title: 'hello', genre: null })
        toExec('/:title/:genre?', '/hello/', { title: 'hello', genre: null })
        toExec('/:title/:genre?', '/hello/world', {
            title: 'hello',
            genre: 'world',
        })
        toExec('/:title/:genre?', '/hello/world/', {
            title: 'hello',
            genre: 'world',
        })
        toExec('/:title/:genre?', '/hello/world/mundo/', false)
        toExec('/:title/:genre?', '/hello/world/mundo', false)

        toExec('/books/*', '/books', false)
        toExec('/books/*', '/books/', { '*': null })
        toExec('/books/*', '/books/world', { '*': 'world' })
        toExec('/books/*', '/books/world/', { '*': 'world/' })
        toExec('/books/*', '/books/world/howdy', { '*': 'world/howdy' })
        toExec('/books/*', '/books/world/howdy/', { '*': 'world/howdy/' })

        toExec('/books/*?', '/books', { '*': null })
        toExec('/books/*?', '/books/', { '*': null })
        toExec('/books/*?', '/books/world', { '*': 'world' })
        toExec('/books/*?', '/books/world/', { '*': 'world/' })
        toExec('/books/*?', '/books/world/howdy', { '*': 'world/howdy' })
        toExec('/books/*?', '/books/world/howdy/', { '*': 'world/howdy/' })
    })

    it('execs :: loose', () => {
        toLooseExec('/books', '/', false)
        toLooseExec('/books', '/books', {})
        toLooseExec('/books', '/books/', {})
        toLooseExec('/books', '/books/world/', {})
        toLooseExec('/books', '/books/world', {})

        toLooseExec('/:title', '/hello', { title: 'hello' })
        toLooseExec('/:title', '/hello/', { title: 'hello' })
        toLooseExec('/:title', '/hello/world/', { title: 'hello' })
        toLooseExec('/:title', '/hello/world', { title: 'hello' })
        toLooseExec('/:title', '/', false)

        toLooseExec('/:title?', '/', { title: null })
        toLooseExec('/:title?', '/hello', { title: 'hello' })
        toLooseExec('/:title?', '/hello/', { title: 'hello' })
        toLooseExec('/:title?', '/hello/world/', { title: 'hello' })
        toLooseExec('/:title?', '/hello/world', { title: 'hello' })

        toLooseExec('/:title.mp4', '/hello.mp4', { title: 'hello' })
        toLooseExec('/:title.mp4', '/hello.mp4/', { title: 'hello' })
        toLooseExec('/:title.mp4', '/hello.mp4/history/', { title: 'hello' })
        toLooseExec('/:title.mp4', '/hello.mp4/history', { title: 'hello' })
        toLooseExec('/:title.mp4', '/', false)

        toLooseExec('/:title/:genre', '/hello/world', {
            title: 'hello',
            genre: 'world',
        })
        toLooseExec('/:title/:genre', '/hello/world/', {
            title: 'hello',
            genre: 'world',
        })
        toLooseExec('/:title/:genre', '/hello/world/mundo/', {
            title: 'hello',
            genre: 'world',
        })
        toLooseExec('/:title/:genre', '/hello/world/mundo', {
            title: 'hello',
            genre: 'world',
        })
        toLooseExec('/:title/:genre', '/hello/', false)
        toLooseExec('/:title/:genre', '/hello', false)

        toLooseExec('/:title/:genre?', '/hello', {
            title: 'hello',
            genre: null,
        })
        toLooseExec('/:title/:genre?', '/hello/', {
            title: 'hello',
            genre: null,
        })
        toLooseExec('/:title/:genre?', '/hello/world', {
            title: 'hello',
            genre: 'world',
        })
        toLooseExec('/:title/:genre?', '/hello/world/', {
            title: 'hello',
            genre: 'world',
        })
        toLooseExec('/:title/:genre?', '/hello/world/mundo/', {
            title: 'hello',
            genre: 'world',
        })
        toLooseExec('/:title/:genre?', '/hello/world/mundo', {
            title: 'hello',
            genre: 'world',
        })

        toLooseExec('/books/*', '/books', false)
        toLooseExec('/books/*', '/books/', { '*': null })
        toLooseExec('/books/*', '/books/world', { '*': 'world' })
        toLooseExec('/books/*', '/books/world/', { '*': 'world/' })
        toLooseExec('/books/*', '/books/world/howdy', { '*': 'world/howdy' })
        toLooseExec('/books/*', '/books/world/howdy/', { '*': 'world/howdy/' })

        toLooseExec('/books/*?', '/books', { '*': null })
        toLooseExec('/books/*?', '/books/', { '*': null })
        toLooseExec('/books/*?', '/books/world', { '*': 'world' })
        toLooseExec('/books/*?', '/books/world/', { '*': 'world/' })
        toLooseExec('/books/*?', '/books/world/howdy', { '*': 'world/howdy' })
        toLooseExec('/books/*?', '/books/world/howdy/', { '*': 'world/howdy/' })
    })

    it('(raw) exec', () => {
        let [url, ...vals] = raw('/foo', '/foo')
        expect(url).toBe('/foo')
        expect(vals).toEqual([])
        ;[url, ...vals] = raw('/foo/', '/foo/')
        expect(url).toBe('/foo/')
        expect(vals).toEqual([])
        ;[url, ...vals] = raw('/:path', '/foo')
        expect(url).toBe('/foo')
        expect(vals).toEqual(['foo'])
        ;[url, ...vals] = raw('/:path', '/foo/')
        expect(url).toBe('/foo/')
        expect(vals).toEqual(['foo'])
        ;[url, ...vals] = raw('/:path/:sub', '/foo/bar')
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['foo', 'bar'])
        ;[url, ...vals] = raw('/:path/:sub', '/foo/bar/')
        expect(url).toBe('/foo/bar/')
        expect(vals).toEqual(['foo', 'bar'])
        ;[url, ...vals] = raw('/:path/:sub?', '/foo')
        expect(url).toBe('/foo')
        expect(vals).toEqual(['foo', undefined])
        ;[url, ...vals] = raw('/:path/:sub?', '/foo/')
        expect(url).toBe('/foo/')
        expect(vals).toEqual(['foo', undefined])
        ;[url, ...vals] = raw('/:path/:sub?', '/foo/bar')
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['foo', 'bar'])
        ;[url, ...vals] = raw('/:path/:sub', '/foo/bar/')
        expect(url).toBe('/foo/bar/')
        expect(vals).toEqual(['foo', 'bar'])
        ;[url, ...vals] = raw('/:path/*', '/foo/bar/baz')
        expect(url).toBe('/foo/bar/baz')
        expect(vals).toEqual(['foo', 'bar/baz'])
        ;[url, ...vals] = raw('/:path/*', '/foo/bar/baz/')
        expect(url).toBe('/foo/bar/baz/')
        expect(vals).toEqual(['foo', 'bar/baz/'])
        ;[url, ...vals] = raw('/foo/:path', '/foo/bar')
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['bar'])
        ;[url, ...vals] = raw('/foo/:path', '/foo/bar/')
        expect(url).toBe('/foo/bar/')
        expect(vals).toEqual(['bar'])
    })

    it('(raw) exec :: loose', () => {
        let [url, ...vals] = raw('/foo', '/foo', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual([])
        ;[url, ...vals] = raw('/foo/', '/foo/', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual([])
        ;[url, ...vals] = raw('/:path', '/foo', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual(['foo'])
        ;[url, ...vals] = raw('/:path', '/foo/', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual(['foo'])
        ;[url, ...vals] = raw('/:path/:sub', '/foo/bar', 1)
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['foo', 'bar'])
        ;[url, ...vals] = raw('/:path/:sub', '/foo/bar/', 1)
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['foo', 'bar'])
        ;[url, ...vals] = raw('/:path/:sub?', '/foo', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual(['foo', undefined])
        ;[url, ...vals] = raw('/:path/:sub?', '/foo/', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual(['foo', undefined])
        ;[url, ...vals] = raw('/:path/:sub?', '/foo/bar', 1)
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['foo', 'bar'])
        ;[url, ...vals] = raw('/:path/:sub', '/foo/bar/', 1)
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['foo', 'bar'])
        ;[url, ...vals] = raw('/:path/*', '/foo/bar/baz', 1)
        expect(url).toBe('/foo/bar/baz')
        expect(vals).toEqual(['foo', 'bar/baz'])
        ;[url, ...vals] = raw('/:path/*', '/foo/bar/baz/', 1)
        expect(url).toBe('/foo/bar/baz/')
        expect(vals).toEqual(['foo', 'bar/baz/'])
        ;[url, ...vals] = raw('/foo/:path', '/foo/bar', 1)
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['bar'])
        ;[url, ...vals] = raw('/foo/:path', '/foo/bar/', 1)
        expect(url).toBe('/foo/bar')
        expect(vals).toEqual(['bar'])
    })

    it('(extra) exec', () => {
        expect(raw('/foo', '/foo/bar')).toBeNull()
        expect(raw('/foo/', '/foo/bar/')).toBeNull()
        expect(raw('/:path', '/foo/bar')).toBeNull()
        expect(raw('/:path', '/foo/bar/')).toBeNull()
    })

    it('(extra) exec :: loose', () => {
        let [url, ...vals] = raw('/foo', '/foo/bar', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual([])
        ;[url, ...vals] = raw('/foo/', '/foo/bar/', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual([])
        ;[url, ...vals] = raw('/:path', '/foo/bar', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual(['foo'])
        ;[url, ...vals] = raw('/:path', '/foo/bar/', 1)
        expect(url).toBe('/foo')
        expect(vals).toEqual(['foo'])
    })

    it('(RegExp) static', () => {
        const rgx = /^\/?books/
        const { keys, pattern } = parse(rgx)
        expect(keys).toBe(false)
        expect(pattern).toBe(rgx)
        expect(pattern.test('/books')).toBe(true)
        expect(pattern.test('/books/')).toBe(true)
    })

    if (hasNamedGroups) {
        it('(RegExp) param', () => {
            const rgx = /^\/(?<year>[0-9]{4})/i
            const { keys, pattern } = parse(rgx)
            expect(keys).toBe(false)
            expect(pattern).toBe(rgx)

            expect(pattern.test('/123')).toBe(false)
            expect(pattern.test('/asdf')).toBe(false)
            expect(pattern.test('/2019')).toBe(true)
            expect(pattern.test('/2019/')).toBe(true)
            expect(pattern.test('2019')).toBe(false)
            expect(pattern.test('/2019/narnia/hello')).toBe(true)

            const [url, value] = pattern.exec('/2019/books')
            expect(url).toBe('/2019')
            expect(value).toBe('2019')

            toExec(rgx, '/2019/books', { year: '2019' })
            toExec(rgx, '/2019/books/narnia', { year: '2019' })
        })

        it('(RegExp) param :: w/ static', () => {
            const rgx = /^\/books\/(?<title>[a-z]+)/i
            const { keys, pattern } = parse(rgx)
            expect(keys).toBe(false)
            expect(pattern).toBe(rgx)

            expect(pattern.test('/books')).toBe(false)
            expect(pattern.test('/books/')).toBe(false)
            expect(pattern.test('/books/narnia')).toBe(true)
            expect(pattern.test('/books/narnia/')).toBe(true)
            expect(pattern.test('/books/narnia/hello')).toBe(true)
            expect(pattern.test('books/narnia')).toBe(false)

            const [url, value] = pattern.exec('/books/narnia')
            expect(url).toBe('/books/narnia')
            expect(value).toBe('narnia')

            toExec(rgx, '/books/narnia', { title: 'narnia' })
            toExec(rgx, '/books/narnia/hello', { title: 'narnia' })
        })

        it('(RegExp) param :: multiple', () => {
            const rgx =
                /^\/(?<year>[0-9]{4})-(?<month>[0-9]{2})\/(?<day>[0-9]{2})/i
            const { keys, pattern } = parse(rgx)
            expect(keys).toBe(false)
            expect(pattern).toBe(rgx)

            expect(pattern.test('/123-1')).toBe(false)
            expect(pattern.test('/123-10')).toBe(false)
            expect(pattern.test('/1234-10')).toBe(false)
            expect(pattern.test('/1234-10/1')).toBe(false)
            expect(pattern.test('/1234-10/as')).toBe(false)
            expect(pattern.test('/1234-10/01/')).toBe(true)
            expect(pattern.test('/2019-10/30')).toBe(true)

            const [url, year, month, day] = pattern.exec('/2019-05/30/')
            expect(url).toBe('/2019-05/30')
            expect(year).toBe('2019')
            expect(month).toBe('05')
            expect(day).toBe('30')

            toExec(rgx, '/2019-10/02', { year: '2019', month: '10', day: '02' })
            toExec(rgx, '/2019-10/02/narnia', {
                year: '2019',
                month: '10',
                day: '02',
            })
        })

        it('(RegExp) param :: suffix', () => {
            const rgx = /^\/movies[/](?<title>\w+)\.mp4/i
            const { keys, pattern } = parse(rgx)
            expect(keys).toBe(false)
            expect(pattern).toBe(rgx)

            expect(pattern.test('/movies')).toBe(false)
            expect(pattern.test('/movies/')).toBe(false)
            expect(pattern.test('/movies/foo')).toBe(false)
            expect(pattern.test('/movies/foo.mp3')).toBe(false)
            expect(pattern.test('/movies/foo.mp4')).toBe(true)
            expect(pattern.test('/movies/foo.mp4/')).toBe(true)

            const [url, title] = pattern.exec('/movies/narnia.mp4')
            expect(url).toBe('/movies/narnia.mp4')
            expect(title).toBe('narnia')

            toExec(rgx, '/movies/narnia.mp4', { title: 'narnia' })
            toExec(rgx, '/movies/narnia.mp4/', { title: 'narnia' })
        })

        it('(RegExp) param :: suffices', () => {
            const rgx = /^\/movies[/](?<title>\w+)\.(mp4|mov)/i
            const { keys, pattern } = parse(rgx)
            expect(keys).toBe(false)
            expect(pattern).toBe(rgx)

            expect(pattern.test('/movies')).toBe(false)
            expect(pattern.test('/movies/')).toBe(false)
            expect(pattern.test('/movies/foo')).toBe(false)
            expect(pattern.test('/movies/foo.mp3')).toBe(false)
            expect(pattern.test('/movies/foo.mp4')).toBe(true)
            expect(pattern.test('/movies/foo.mp4/')).toBe(true)
            expect(pattern.test('/movies/foo.mov/')).toBe(true)

            const [url, title] = pattern.exec('/movies/narnia.mov')
            expect(url).toBe('/movies/narnia.mov')
            expect(title).toBe('narnia')

            toExec(rgx, '/movies/narnia.mov', { title: 'narnia' })
            toExec(rgx, '/movies/narnia.mov/', { title: 'narnia' })
        })

        it('(RegExp) param :: optional', () => {
            const rgx = /^\/books[/](?<author>[^/]+)[/]?(?<title>[^/]+)?[/]?$/
            const { keys, pattern } = parse(rgx)
            expect(keys).toBe(false)
            expect(pattern).toBe(rgx)

            expect(pattern.test('/books')).toBe(false)
            expect(pattern.test('/books/')).toBe(false)
            expect(pattern.test('/books/smith')).toBe(true)
            expect(pattern.test('/books/smith/')).toBe(true)
            expect(pattern.test('/books/smith/narnia')).toBe(true)
            expect(pattern.test('/books/smith/narnia/')).toBe(true)
            expect(pattern.test('/books/smith/narnia/reviews')).toBe(false)
            expect(pattern.test('books/smith/narnia')).toBe(false)

            const [url, author, title] = pattern.exec('/books/smith/narnia/')
            expect(url).toBe('/books/smith/narnia/')
            expect(author).toBe('smith')
            expect(title).toBe('narnia')

            toExec(rgx, '/books/smith/narnia', {
                author: 'smith',
                title: 'narnia',
            })
            toExec(rgx, '/books/smith/narnia/', {
                author: 'smith',
                title: 'narnia',
            })
            toExec(rgx, '/books/smith/', { author: 'smith', title: undefined })
        })
    }

    it('(RegExp) nameless', () => {
        const rgx = /^\/books[/]([^/]\w+)[/]?(\w+)?(?=\/|$)/i
        const { keys, pattern } = parse(rgx)
        expect(keys).toBe(false)
        expect(pattern).toBe(rgx)

        expect(pattern.test('/books')).toBe(false)
        expect(pattern.test('/books/')).toBe(false)
        expect(pattern.test('/books/smith')).toBe(true)
        expect(pattern.test('/books/smith/')).toBe(true)
        expect(pattern.test('/books/smith/narnia')).toBe(true)
        expect(pattern.test('/books/smith/narnia/')).toBe(true)
        expect(pattern.test('books/smith/narnia')).toBe(false)

        const [url, author, title] = pattern.exec('/books/smith/narnia/')
        expect(url).toBe('/books/smith/narnia')
        expect(author).toBe('smith')
        expect(title).toBe('narnia')

        toExec(rgx, '/books/smith/narnia', {})
        toExec(rgx, '/books/smith/narnia/', {})
        toExec(rgx, '/books/smith/', {})
    })
})
