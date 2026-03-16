import { describe, it, expect } from 'vitest'
import { inject } from '../../regexparam.js'

function run(pattern, expected, values) {
    const keys = Object.keys(values)
    it(`inject "${pattern}" with [${keys}]`, () => {
        const output = inject(pattern, values)
        expect(typeof output).toBe('string')
        expect(output).toBe(expected)
    })
}

describe('inject()', () => {
    it('exports', () => {
        expect(typeof inject).toBe('function')
    })

    it('returns', () => {
        const output = inject('/', {})
        expect(typeof output).toBe('string')
    })

    it('throws', () => {
        expect(() => inject('/:foo/:bar')).toThrow(
            /Cannot read propert(ies|y 'foo') of undefined/,
        )
    })

    run('/foo/:id', '/foo/123', { id: 123 })
    run('/foo/:id/', '/foo/123/', { id: 123 })

    run('/:a/:b/:c', '/1/2/3', { a: 1, b: 2, c: 3 })
    run('/:a/:b/:c/', '/1/2/3/', { a: 1, b: 2, c: 3 })

    run('/assets/:video.mp4', '/assets/demo.mp4', { video: 'demo' })
    run('/assets/:video.mp4/extra', '/assets/demo.mp4/extra', { video: 'demo' })
    run('/assets/:video.mp4?foo=bar', '/assets/demo.mp4?foo=bar', {
        video: 'demo',
    })
    run('/assets/:video/.hidden', '/assets/demo/.hidden', { video: 'demo' })

    run('/foo/:id/:bar?', '/foo/123', { id: 123 })
    run('/foo/:id/:bar?/', '/foo/123/', { id: 123 })

    run('/foo/:id/:bar?', '/foo/123/xxx', { id: 123, bar: 'xxx' })
    run('/foo/:id/:bar?/', '/foo/123/xxx/', { id: 123, bar: 'xxx' })

    run('/foo/:id/:bar?/extra', '/foo/123/extra', { id: 123 })
    run('/foo/:id/:bar?/extra', '/foo/123/xxx/extra', { id: 123, bar: 'xxx' })

    run('/foo/:id/:a?/:b?/:bar?', '/foo/123', { id: 123 })
    run('/foo/:id/:a?/:b?/:bar?', '/foo/123/bb', { id: 123, b: 'bb' })
    run('/foo/:id/:a?/:b?/:bar?', '/foo/123/xxx', { id: 123, bar: 'xxx' })
    run('/foo/:id/:a?/:b?/:bar?', '/foo/123/aa/xxx', {
        id: 123,
        a: 'aa',
        bar: 'xxx',
    })

    run('/foo/:bar/*', '/foo/123', { bar: '123' })
    run('/foo/:bar/*?', '/foo/123', { bar: '123' })

    run('/foo/:bar/*', '/foo/123/aa/bb/cc', { bar: '123', '*': 'aa/bb/cc' })
    run('/foo/:bar/*?', '/foo/123/aa/bb/cc', { bar: '123', '*': 'aa/bb/cc' })

    // NOTE: Missing non-optional values
    run('/foo/:id', '/foo/:id', {
        /* empty */
    })
    run('/foo/:id/', '/foo/:id/', {
        /* empty */
    })

    run('/:a/:b/:c', '/1/:b/:c', { a: 1 })
    run('/:a/:b/:c', '/1/:b/3', { a: 1, c: 3 })
})
