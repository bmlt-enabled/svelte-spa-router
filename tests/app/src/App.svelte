<script>
    import Router, { link, push, pop, replace } from '../../../Router.svelte'
    import active from '../../../active.js'
    import { routes, wasSecondConditionCalled } from './routes.js'

    let conditionsFailed = $state(false)
    let conditionsFailedDetail = $state(null)

    // expose for Playwright
    window.__wasSecondConditionCalled = wasSecondConditionCalled
</script>

<nav>
    <a id="nav-home" href="/" use:link use:active>Home</a>
    <a id="nav-about" href="/about" use:link use:active>About</a>
    <a id="nav-user" href="/user/world" use:link>User</a>
</nav>

<button id="btn-push" onclick={() => push('/about')}>push /about</button>
<button id="btn-replace" onclick={() => replace('/about')}
    >replace /about</button
>
<button id="btn-pop" onclick={() => pop()}>pop</button>

{#if conditionsFailed}
    <p id="conditions-failed">conditions failed</p>
    {#if conditionsFailedDetail?.userData}
        <p id="conditions-failed-userdata">
            {JSON.stringify(conditionsFailedDetail.userData)}
        </p>
    {/if}
{/if}

<main>
    <Router
        {routes}
        onConditionsFailed={(detail) => {
            conditionsFailed = true
            conditionsFailedDetail = detail
        }}
    />
</main>
