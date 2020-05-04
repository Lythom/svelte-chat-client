<script>
    import {afterUpdate, beforeUpdate, onMount, onDestroy} from "svelte";
    import {MSG_PREFIX, USERNAME_SEPARATOR} from "../api";

    export let sendMessage
    export let subscribeToMessages

    let messages = []
    let chatInput
    let chatInputValue = ""
    let unsubscribe

    onMount(() => {
        unsubscribe = subscribeToMessages(handleServerWSMessage)
        chatInput.focus()
        const storagemessages = localStorage.getItem("messages");
        try {
            messages = JSON.parse(storagemessages)
        } catch (_) {}
    })

    onDestroy(() => {
        localStorage.setItem("messages", JSON.stringify(messages))
        if (unsubscribe != null) unsubscribe()
    })

    function handleChatMessage() {
        sendMessage(MSG_PREFIX + chatInputValue);
        chatInputValue = '';
        chatInput.focus();
    }

    function handleServerWSMessage(msg) {
        let userMsg = msg.data.split(USERNAME_SEPARATOR)
        if (userMsg.length === 1) {
            // no user name, probably a server message
            messages = [...messages, userMsg[0]]
        } else if (userMsg.length >= 2) {
            const user = userMsg[0]
            // keep the message without the username
            const text = msg.data.replace(userMsg[0] + USERNAME_SEPARATOR, '')
            // only display the message if it's tag with prefix
            if (!text.startsWith(MSG_PREFIX)) return
            messages = [...messages, '[' + user + '] ' + text.replace(MSG_PREFIX, '')];
        }
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
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
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