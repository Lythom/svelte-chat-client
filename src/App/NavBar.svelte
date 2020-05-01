<script>
    export let navigate;
    export let page;
    export let chatActive;
    export let onLogout;
</script>

<nav>
    <h1>My Chat</h1>
    <ul>
        <li><a href="." on:click|preventDefault={navigate} style={page === '/' ? 'color: black' : null}>Home</a>
        </li>
        <li><a href="page1" on:click|preventDefault={navigate} style={page === '/page1' ? 'color: black' : null}>Page
            1</a></li>
        <li><a href="about" on:click|preventDefault={navigate} style={page === '/about' ? 'color: black' : null}>about</a>
        </li>
        <li style="display: {chatActive ? 'block' : 'none'}">
            <button on:click={onLogout}><i>Disconnect</i></button>
        </li>
    </ul>
</nav>

<style>
    nav {
        margin-bottom: 1rem
    }
</style>