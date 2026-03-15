<script>
    const { onRouteEvent = () => {} } = $props()
</script>

<p id="page-event">Event page</p>
<button id="btn-fire-event" onclick={() => onRouteEvent({ message: 'hello' })}>
    Fire event
</button>
