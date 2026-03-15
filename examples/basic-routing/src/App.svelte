<script>
    import Router, { link } from '../../../Router.svelte'
    import active from '../../../active.js'
    import { routes } from './routes.js'
</script>

<nav>
    <a href="/" use:link use:active>Home</a>
    <a href="/hello/world" use:link use:active={{ path: '/hello/*' }}>Hello</a>
    <a href="/lazy" use:link use:active>Lazy</a>
    <a href="/lazy-with-loading" use:link use:active>Lazy with loading</a>
</nav>

<main>
    <Router {routes} />
</main>

<style>
    nav a {
        margin-right: 1rem;
    }
    nav :global(a.active) {
        font-weight: bold;
    }
</style>
