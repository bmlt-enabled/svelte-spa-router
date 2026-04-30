/**
 * Type smoke test for the public API.
 *
 * This file is type-checked (not executed) by `npm run test:types`. It imports
 * every public export and exercises its declared shape, so that drift between
 * the `.d.ts` files and the actual JS/Svelte sources fails compilation.
 *
 * Add a use site here for any new public export.
 */
import type { Component } from 'svelte'

import Router, {
    type RouteDetail,
    type RouteDetailLoaded,
    type RoutePrecondition,
    type WrappedComponent,
    type LinkActionOpts,
    type LinkActionUpdateFunc,
    type LinkActionUpateFunc,
    type RouterState,
    type RouteDefinition,
    type RouterProps,
    setHashMode,
    push,
    pop,
    replace,
    link,
    restoreScroll,
    router,
} from '../../Router'
import active from '../../active'
import { wrap, type WrapOptions } from '../../wrap'
import { parse, inject, type RouteParams } from '../../regexparam'

// --- Router default export is a Svelte Component ---
const _RouterComponent: Component<RouterProps> = Router

// --- Navigation functions return Promise<void> ---
const _push: Promise<void> = push('/foo')
const _pushHash: Promise<void> = push('#/foo')
const _pop: Promise<void> = pop()
const _replace: Promise<void> = replace('/bar')

// --- setHashMode signatures ---
setHashMode(true)
setHashMode(false, '/meetings')

// --- router state object (readonly fields) ---
const _loc: { location: string; querystring: string } = router.loc
const _location: string = router.location
const _qs: string = router.querystring
const _params: Record<string, string> | RegExpExecArray | undefined =
    router.params

// --- link action returns both update and destroy ---
const node = {} as HTMLElement
const linkResult = link(node, { href: '/x', disabled: false })
const _update: LinkActionUpdateFunc = linkResult.update
const _destroy: () => void = linkResult.destroy
// String overload still works
const linkResult2 = link(node, '/x')
linkResult2.destroy()
linkResult2.update('/y')
// Backwards-compat typo alias
const _typoAlias: LinkActionUpateFunc = linkResult.update

// --- restoreScroll: optional state arg with the documented shape ---
restoreScroll()
restoreScroll({
    __svelte_spa_router_scrollX: 0,
    __svelte_spa_router_scrollY: 0,
})

// --- active action returns { destroy } ---
const activeResult = active(node)
const _activeDestroy: () => void = activeResult.destroy
active(node, '/foo')
active(node, /^\/foo/)
active(node, {
    path: '/foo',
    className: 'is-active',
    inactiveClassName: 'is-inactive',
})

// --- wrap: returns a WrappedComponent whose `component` is async ---
const FakeComponent = {} as Component<any, any>
const wrapped: WrappedComponent = wrap({ component: FakeComponent })
// The component on the wrapped object must be callable (AsyncSvelteComponent)
const _loaded: Promise<{ default: Component<any, any> }> = wrapped.component()

// wrap with all options
const wrapOpts: WrapOptions = {
    asyncComponent: () => Promise.resolve({ default: FakeComponent }),
    loadingComponent: FakeComponent,
    loadingParams: { msg: 'loading' },
    userData: { foo: 'bar' },
    props: { x: 1 },
    conditions: [(detail: RouteDetail) => detail.location !== '/blocked'],
}
wrap(wrapOpts)

// Single condition (not array) is also accepted
wrap({
    component: FakeComponent,
    conditions: (detail) => Boolean(detail),
})

// --- RouteDefinition accepts both records and Maps ---
const routesRecord: RouteDefinition = {
    '/': FakeComponent,
    '/wrapped': wrapped,
}
const routesMap: RouteDefinition = new Map<
    string | RegExp,
    Component<any, any> | WrappedComponent
>([
    ['/', FakeComponent],
    [/^\/regex/, wrapped],
])

// --- RouterProps shape (verifies callbacks accept the right detail shape) ---
const routerProps: RouterProps = {
    routes: routesRecord,
    prefix: '/app',
    hashMode: false,
    basePath: '/meetings',
    restoreScrollState: true,
    onConditionsFailed: (d: RouteDetail) => void d,
    onRouteLoading: (d: RouteDetail) => void d,
    onRouteLoaded: (d: RouteDetailLoaded) => {
        const _name: string = d.name
        const _component: Component<any, any> = d.component
    },
    onRouteEvent: (d: unknown) => void d,
}
void routerProps
void routesMap

// --- RoutePrecondition signature ---
const cond: RoutePrecondition = (detail) => {
    const _route: string | RegExp = detail.route
    const _l: string = detail.location
    const _qs2: string = detail.querystring
    const _p: Record<string, string> | RegExpExecArray | null = detail.params
    return true
}
void cond

// --- regexparam.parse: string overload returns string[] keys ---
const parsedString = parse('/books/:id')
const _stringKeys: string[] = parsedString.keys
const _stringPattern: RegExp = parsedString.pattern
parse('/books/:id', true)

// --- regexparam.parse: RegExp overload returns false keys ---
const parsedRegex = parse(/^\/books/)
const _falseKeys: false = parsedRegex.keys

// --- regexparam.inject: param keys are inferred from route literal ---
const _injected: string = inject('/books/:id', { id: '42' })
inject('/users/:name?', { name: 'optional-or-undefined' })
inject('/users/:name?', {})
inject('/files/*', { '*': 'a/b/c' })

// Compile-time check that RouteParams<T> infers the right keys
type _Params1 = RouteParams<'/books/:id'>
const _p1: _Params1 = { id: '42' }
void _p1

// --- LinkActionOpts shape ---
const linkOpts: LinkActionOpts = { href: '/x', disabled: true }
void linkOpts

// --- RouterState is read-only (sanity) ---
const _state: RouterState = router
void _state
