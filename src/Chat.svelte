<script>
    export let onChatMessage
    export let chatActive
    export let messages
    export let chatInput = null
    export let chatInputValue = ""
</script>

<form on:submit|preventDefault={onChatMessage} style="width: 100%;display: {chatActive ? 'block' : 'none'}">
    <ul>
        {#each messages as message}
            <li>{message}</li>
        {/each}
    </ul>
    <label>
        Message:&nbsp;<input name="message" bind:this={chatInput} bind:value={chatInputValue}
                             style="width: 100%;box-sizing: border-box"/>
    </label>
    <input type="submit"/>
</form>