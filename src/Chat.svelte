<script>
    import {afterUpdate, beforeUpdate, onMount, onDestroy} from "svelte";

    export let sendMessage
    export let subscribeToMessages

    let messages = []
    let chatInput
    let chatInputValue = ""
    let unsubscribe

    onMount(() => {
        unsubscribe = subscribeToMessages(handleServerWSMessage)
        chatInput.focus()
    })

    onDestroy(() => {
        if (unsubscribe != null) unsubscribe()
    })

    function handleChatMessage() {
        sendMessage(chatInputValue);
        chatInputValue = '';
        chatInput.focus();
    }

    function handleServerWSMessage(msg) {
        messages = [...messages, msg.data];
    }

    // from https://svelte.dev/tutorial/update
    let scrollableArea;
    let autoscroll;
    beforeUpdate(() => {
        autoscroll = scrollableArea && (scrollableArea.offsetHeight + scrollableArea.scrollTop) > (scrollableArea.scrollHeight - 20);
    });

    afterUpdate(() => {
        if (autoscroll) scrollableArea.scrollTo(0, scrollableArea.scrollHeight);
    });
</script>

<form on:submit|preventDefault={handleChatMessage} class="chat">
    <ul class="scrollable" bind:this={scrollableArea}>
        {#each messages as message}
            <li>{message}</li>
        {/each}
    </ul>
    <label>
        Message:&nbsp;<input name="message" bind:this={chatInput} bind:value={chatInputValue}/>
    </label>
    <input type="submit"/>
</form>

<style>
    .chat {
        position: relative;
        display: flex;
        flex-direction: column;
        max-height: 65vh;
    }

    .scrollable {
        flex: 1 1 auto;
        border-top: 1px solid #eee;
        margin: 0 0 0.5em 0;
        overflow-y: auto;
    }

    input[name=message] {
        width: 100%;
        box-sizing: border-box;
    }
</style>