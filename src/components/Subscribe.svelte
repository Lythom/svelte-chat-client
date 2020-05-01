<script>
    export let onSubscribe
    export let login = ""
    export let password = ""
    export let email = ""
</script>

<form on:submit|preventDefault={onSubscribe}>
    <h2>Inscription</h2>
    <label>login: <input name="login" type="text" bind:value={login}></label>
    <label>password: <input name="password" type="password" bind:value={password}></label>
    <label>email: <input name="email" type="email" bind:value={email}></label>
    <input type="submit">
</form>