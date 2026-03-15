import { describe, it, expect } from 'vitest'
import { wrap } from '../../wrap.js'

describe('wrap()', () => {
    it('throws if no args', () => {
        expect(() => wrap()).toThrow('Parameter args is required')
    })

    it('throws if neither component nor asyncComponent given', () => {
        expect(() => wrap({})).toThrow('One and only one')
    })

    it('throws if both component and asyncComponent given', () => {
        expect(() =>
            wrap({ component: () => {}, asyncComponent: () => {} }),
        ).toThrow('One and only one')
    })

    it('wraps a sync component into an async one', () => {
        const Component = () => {}
        const result = wrap({ component: Component })
        expect(result._sveltesparouter).toBe(true)
        expect(typeof result.component).toBe('function')
        return result.component().then((c) => expect(c).toBe(Component))
    })

    it('accepts asyncComponent', () => {
        const loader = () => Promise.resolve({ default: {} })
        const result = wrap({ asyncComponent: loader })
        expect(result.component).toBe(loader)
    })

    it('attaches conditions as array', () => {
        const cond = () => true
        const result = wrap({
            asyncComponent: () => Promise.resolve({}),
            conditions: cond,
        })
        expect(result.conditions).toEqual([cond])
    })

    it('attaches conditions array as-is', () => {
        const conds = [() => true, () => false]
        const result = wrap({
            asyncComponent: () => Promise.resolve({}),
            conditions: conds,
        })
        expect(result.conditions).toBe(conds)
    })

    it('attaches props', () => {
        const result = wrap({
            asyncComponent: () => Promise.resolve({}),
            props: { foo: 'bar' },
        })
        expect(result.props).toEqual({ foo: 'bar' })
    })

    it('attaches userData', () => {
        const result = wrap({
            asyncComponent: () => Promise.resolve({}),
            userData: { role: 'admin' },
        })
        expect(result.userData).toEqual({ role: 'admin' })
    })

    it('attaches loadingComponent', () => {
        const Loader = () => {}
        const result = wrap({
            asyncComponent: () => Promise.resolve({}),
            loadingComponent: Loader,
        })
        expect(result.component.loading).toBe(Loader)
    })

    it('throws if asyncComponent is not a function', () => {
        expect(() => wrap({ asyncComponent: 'not-a-function' })).toThrow(
            'Parameter asyncComponent must be a function',
        )
    })

    it('throws if condition is not a function', () => {
        expect(() =>
            wrap({ asyncComponent: () => {}, conditions: ['bad'] }),
        ).toThrow('Invalid parameter conditions[0]')
    })
})
