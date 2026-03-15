import Home from './routes/Home.svelte'
import About from './routes/About.svelte'
import User from './routes/User.svelte'
import NotFound from './routes/NotFound.svelte'
import Loading from './routes/Loading.svelte'
import { wrap } from '../../../wrap.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let secondConditionCalled = false

export function wasSecondConditionCalled() {
    return secondConditionCalled
}

export const routes = {
    '/': Home,
    '/about': About,
    '/user/:name': User,
    '/lazy': wrap({
        asyncComponent: () => import('./routes/Lazy.svelte'),
    }),
    // condition always fails
    '/protected': wrap({
        asyncComponent: () => import('./routes/Protected.svelte'),
        conditions: [() => false],
    }),
    // async condition that passes
    '/guarded-async': wrap({
        asyncComponent: () => import('./routes/Guarded.svelte'),
        conditions: [() => Promise.resolve(true)],
    }),
    // two conditions: first fails, second should never run
    '/guarded-multi': wrap({
        asyncComponent: () => import('./routes/Guarded.svelte'),
        conditions: [
            () => false,
            () => {
                secondConditionCalled = true
                return true
            },
        ],
    }),
    // loading component shown while async route resolves
    '/slow': wrap({
        asyncComponent: () =>
            delay(500).then(() => import('./routes/Slow.svelte')),
        loadingComponent: Loading,
        loadingParams: { message: 'Loading route...' },
    }),
    // condition receives userData in detail
    '/guarded-userdata': wrap({
        asyncComponent: () => import('./routes/Guarded.svelte'),
        userData: { role: 'admin' },
        conditions: [(detail) => detail.userData?.role === 'admin'],
    }),
    '*': NotFound,
}
