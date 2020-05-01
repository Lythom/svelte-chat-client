<script>
    export let onLogin
    export let login = ""
    export let password = ""
</script>

<form on:submit|preventDefault={onLogin}>
    <h2>Connexion</h2>
    <label>login: <input name="login" type="text" bind:value={login}></label>
    <label>password: <input name="password" type="password" bind:value={password}></label>
    <input type="submit">
</form>