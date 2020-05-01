<script>
    export let feedback;
</script>

{#if feedback !== '' && feedback != null}
    <article>
        <aside><p>{feedback}</p></aside>
    </article>
    <br/>
{/if}