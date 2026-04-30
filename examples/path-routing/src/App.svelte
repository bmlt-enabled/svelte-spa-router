<script>
    import Router, { link, push, router } from '../../../Router.svelte'
    import active from '../../../active.svelte.js'
    import { routes } from './routes.js'

    // To mount the app under a sub-path (e.g. https://example.com/app/...),
    // pass `basePath="/app"` below. The router will strip the prefix from
    // incoming URLs and prepend it to outgoing ones, so route definitions
    // and `push()` arguments stay clean (e.g. `push('/books')`, not `push('/app/books')`).
</script>

<nav>
    <a href="/" use:link use:active>Home</a>
    <a href="/about" use:link use:active>About</a>
    <a href="/books/42" use:link use:active={{ path: '/books/*' }}>Book 42</a>
</nav>

<button onclick={() => push('/about')}>push('/about')</button>

<p>
    <small>Current path: <code>{router.location}</code></small>
</p>

<main>
    <Router {routes} hashMode={false} />
    <!-- Mount under a sub-path with: <Router {routes} hashMode={false} basePath="/app" /> -->
</main>

<style>
    nav a {
        margin-right: 1rem;
    }
    nav :global(a.active) {
        font-weight: bold;
    }
</style>
