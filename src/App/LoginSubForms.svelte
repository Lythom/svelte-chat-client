<script>
    import Subscribe from "../components/Subscribe.svelte";
    import Login from "../components/Login.svelte";
    import * as backendAPI from "../api.js"

    export let updateFeedback
    export let connectToChat

    let login;
    let password;
    let email;

    async function handleSubscribe() {
        const response = await backendAPI.subscribe(login, password, email);
        const registerResponseValue = await response.text();
        if (updateFeedback != null) {
            if (!registerResponseValue.ok) {
                updateFeedback(registerResponseValue);
            } else {
                updateFeedback('Le compte a été créé !');
            }
        }
        password = '';
    }

    async function handleLogin() {
        const loginResponse = await backendAPI.login(login, password);
        const loginResponseValue = await loginResponse.text();
        if (loginResponseValue.ok) {
            if (updateFeedback != null) updateFeedback(loginResponseValue);
            password = ''
            return;
        }

        await connectToChat();
    }
</script>

<Subscribe onSubscribe={handleSubscribe} bind:login bind:password bind:email/>
<div style="padding-left: 2rem">
    <Login onLogin={handleLogin} bind:login bind:password/>
</div>