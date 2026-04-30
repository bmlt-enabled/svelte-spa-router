<script>
    const { params } = $props()
</script>

<h1>Book {params.id}</h1>
<p>Params: <code>{JSON.stringify(params)}</code></p>
