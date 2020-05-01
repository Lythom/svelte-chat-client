<script>
    import Subscribe from "./Subscribe.svelte";
    import Login from "./Login.svelte";
    import Chat from "./Chat.svelte";
    import * as backendAPI from "./api.js"

    let login;
    let password;
    let email;
    let feedback = '';

    let ws;
    let chatActive = false;
    let connecting = false;

    async function autoLogin() {
        connecting = true
        const response = await backendAPI.status()
        const responseValue = await response.text();
        if (responseValue !== 'Visiteur') {
            await connectToChat();
        }
        connecting = false
    }

    autoLogin();

    async function handleSubscribe() {
        const response = await backendAPI.subscribe(login, password, email);
        const registerResponseValue = await response.text();
        if (!registerResponseValue.ok) {
            feedback = registerResponseValue;
        } else {
            feedback = 'Le compte a été créé !';
        }
        password = '';
    }

    async function handleLogin() {
        const loginResponse = await backendAPI.login(login, password);
        const loginResponseValue = await loginResponse.text();
        if (loginResponseValue.ok) {
            feedback = loginResponseValue;
            return;
        }

        await connectToChat();
    }

    async function connectToChat() {
        connecting = true
        feedback = "Connexion au serveur en cours…";
        const ticketResponse = await backendAPI.wsTicket()
        const ticketResponseValue = await ticketResponse.text();
        if (ticketResponse.ok) {
            ws = await backendAPI.startWebsocket(ticketResponseValue, handleWSMessage, disconnect);
            password = '';
            feedback = "Connecté !"
            chatActive = true;
        } else {
            feedback = ticketResponseValue;
        }
        connecting = false
    }

    function sendWSMessage(msg) {
        ws.send(msg)
    }

    function disconnect() {
        chatActive = false;
        if (ws != null) ws.close();
        feedback = 'Disconnected'
    }

    async function logout() {
        disconnect()
        await backendAPI.logout()
    }


    //// SUBSCRIPTION example here
    // 1. register a handler to be notified by event (here it's handleWSMessage)
    // 2. give child component a function that allow it to register it's own callback (here it's subscribeToMessages)
    // 3. When the child subscribe, keep the reference to the child handler (here in childChatHandler, could be an array to handle multiple child subscriptions)

    // keep the callback function that the Chat component want the App to use when a new message arrive
    let childChatHandler;

    // handleWSMessage is called when a message arrive, it is registered as callback on the websocket
    function handleWSMessage(msg) {
        if (childChatHandler != null) childChatHandler(msg)
    }

    // this function is given to the Chat component so that it can tell the app what callback function the App should use.
    function subscribeToMessages(handler) {
        childChatHandler = handler
        // a subcription function often return an unsubscription function. Alternatively an "unsubscribe" function can be provided in another way.
        return () => childChatHandler = null
    }

    //
    //// END of SUBSCRIPTION example
</script>

<main>
    <nav>
        <h1>My Chat</h1>
        <ul style="display: {chatActive ? 'block' : 'none'}">
            <li>
                <button on:click={logout}><i>Disconnect</i></button>
            </li>
        </ul>
    </nav>

    {#if feedback !== '' && feedback != null}
        <article>
            <aside><p>{feedback}</p></aside>
        </article>
        <br/>
    {/if}
    {#if !chatActive && !connecting}
        <section>
            <Subscribe onSubscribe={handleSubscribe} bind:login bind:password bind:email/>
            <div style="padding-left: 2rem">
                <Login onLogin={handleLogin} bind:login bind:password/>
            </div>
        </section>
    {/if}
    <section style="width: 100%;display: {chatActive ? 'block' : 'none'}">
        <Chat subscribeToMessages={subscribeToMessages} sendMessage={sendWSMessage}/>
    </section>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: var(--width-content);
        margin: 0 auto;
    }

    nav {
        margin-bottom: 1rem
    }

    ul {
        text-align: left;
    }
</style>