<script>
    import {onMount, onDestroy} from "svelte";
    import {MOV_PREFIX, USERNAME_SEPARATOR} from "../api";

    export let sendMessage
    export let subscribeToMessages

    let users = {}
    let unsubscribe
    let x, y = 250
    let playground

    onMount(() => {
        unsubscribe = subscribeToMessages(handleServerWSMessage)
        const storageusers = localStorage.getItem("users");
        try {
            if (storageusers != null) users = JSON.parse(storageusers)
        } catch (_) {}
    })

    onDestroy(() => {
        localStorage.setItem("users", JSON.stringify(users))
        if (unsubscribe != null) unsubscribe()
    })

    function handleMoveMessage(evt) {
        const rect = playground.getBoundingClientRect()
        const x = evt.clientX - rect.left
        const y = evt.clientY - rect.top
        sendMessage(MOV_PREFIX + Math.round(x) + ',' + Math.round(y));
    }

    function handleServerWSMessage(msg) {
        let userMsg = msg.data.split(USERNAME_SEPARATOR)
        if (userMsg.length >= 2) {
            const user = userMsg[0]
            // keep the message without the username
            let text = msg.data.replace(userMsg[0] + USERNAME_SEPARATOR, '')
            // only display the position if it's tag with prefix
            if (!text.startsWith(MOV_PREFIX)) return
            text = text.replace(MOV_PREFIX, '')
            // parse position
            const pos = text.split(',')
            if (pos.length !== 2) return
            users = {
                ...users,
                [user]: {
                    x: parseInt(pos[0]),
                    y: parseInt(pos[1]),
                }
            }
        }
    }
</script>

<div bind:this={playground} on:click|preventDefault={handleMoveMessage} class="playground">
    {#each Object.entries(users) as [user, pos]}
        <div class="user" style={`transform: translate(${pos.x}px,${pos.y}px)`}>{user}</div>
    {/each}
</div>

<style>
    .playground {
        border: 1px solid black;
        padding: 5px;
        position: relative;
        width: 500px;
        height: 500px;
        box-sizing: border-box;
    }

    .user {
        border: 1px dotted black;
        width: 60px;
        height: 20px;
        font-size: 1rem;
        line-height: 20px;
        text-align: center;
        transition: transform 100ms linear;
        position: absolute;
    }
</style>