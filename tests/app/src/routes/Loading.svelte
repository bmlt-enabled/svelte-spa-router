<script>
    const { params } = $props()
</script>

<p id="page-loading">{params?.message ?? 'Loading...'}</p>
