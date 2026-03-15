<script>
    const { params } = $props()
</script>

<h1>Hello, {params.name}!</h1>
<p>Params is: <code>{JSON.stringify(params)}</code></p>
