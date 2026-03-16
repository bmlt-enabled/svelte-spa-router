<script>
    import Router, { link, push, pop, replace } from '../../../Router.svelte'
    import active from '../../../active.svelte.js'
    import { routes, wasSecondConditionCalled } from './routes.js'

    let conditionsFailed = $state(false)
    let conditionsFailedDetail = $state(null)
    let routeLoadingDetail = $state(null)
    let routeLoadedDetail = $state(null)
    let routeEventDetail = $state(null)

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

{#if routeLoadingDetail}
    <p id="route-loading-location">{routeLoadingDetail.location}</p>
{/if}

{#if routeLoadedDetail}
    <p id="route-loaded-location">{routeLoadedDetail.location}</p>
{/if}

{#if routeEventDetail}
    <p id="route-event-payload">{JSON.stringify(routeEventDetail)}</p>
{/if}

<main>
    <Router
        {routes}
        onConditionsFailed={(detail) => {
            conditionsFailed = true
            conditionsFailedDetail = detail
        }}
        onRouteLoading={(detail) => {
            routeLoadingDetail = detail
        }}
        onRouteLoaded={(detail) => {
            routeLoadedDetail = detail
        }}
        onRouteEvent={(detail) => {
            routeEventDetail = detail
        }}
    />
</main>
