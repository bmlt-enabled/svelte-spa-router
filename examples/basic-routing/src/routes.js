import Home from './routes/Home.svelte'
import Name from './routes/Name.svelte'
import NotFound from './routes/NotFound.svelte'
import Loading from './routes/Loading.svelte'
import { wrap } from '../../../wrap.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const routes = {
    '/': Home,
    '/hello/:name': Name,
    '/lazy': wrap({
        asyncComponent: () => import('./routes/Lazy.svelte'),
    }),
    '/lazy-with-loading': wrap({
        asyncComponent: () =>
            delay(1000).then(() => import('./routes/Lazy.svelte')),
        loadingComponent: Loading,
        loadingParams: { message: 'Loading page...' },
    }),
    '*': NotFound,
}
