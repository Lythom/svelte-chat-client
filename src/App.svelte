<script>
    import Subscribe from "./Subscribe.svelte";
    import Login from "./Login.svelte";
    import Chat from "./Chat.svelte";

    export let API_SERVER;
    export let WS_SERVER;

    let login;
    let password;
    let email;
    let chatActive = false;
    let feedback = '';
    let messages = ['Début du chat'];

    let ws;
    let chatInput;
    let chatInputValue;

    async function autoLogin() {
        const response = await fetch(`${API_SERVER}/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const responseValue = await response.text();
        if (responseValue !== 'Visiteur') {
            connectToChat();
        }
    }

    autoLogin();

    async function handleSubscribe() {
        const response = await fetch(`${API_SERVER}/subscribe`, {
            method: 'POST',
            body: JSON.stringify({
                "username": login,
                "password": password,
                "email": email,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const registerResponseValue = await response.text();
        if (!registerResponseValue.ok) {
            feedback = registerResponseValue;
        } else {
            feedback = 'Le compte a été créé !';
        }
        password = '';
    }

    async function connectToChat() {
        const ticketResponse = await fetch(`${API_SERVER}/wsTicket`, {
            method: 'GET',
            credentials: 'include'
        });

        const ticketResponseValue = await ticketResponse.text();
        if (ticketResponse.ok) {
            ws = new WebSocket(WS_SERVER);
            ws.addEventListener('open', () => {
                ws.send(ticketResponseValue);
                chatActive = true;
                password = '';
                chatInput.focus();
                feedback = "Connecté !"
            });
            ws.addEventListener('message', handleServerWSMessage)
            feedback = "Connexion au serveur en cours…";
        } else {
            feedback = ticketResponseValue;
        }
    }

    async function handleLogin() {
        const loginResponse = await fetch(`${API_SERVER}/login`, {
            method: 'POST',
            body: JSON.stringify({
                "username": login,
                "password": password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const loginResponseValue = await loginResponse.text();
        if (loginResponseValue.ok) {
            feedback = loginResponseValue;
            return;
        }

        await connectToChat();
    }

    function handleChatMessage() {
        ws.send(chatInputValue);
        chatInputValue = '';
        chatInput.focus();
    }

    function handleServerWSMessage(msg) {
        messages = [...messages, msg.data];
    }

    function disconnect() {
        chatActive = false;
        ws.close();
        feedback = 'Disconnected'
    }
</script>

<main>
    <nav>
        <h1>My Chat</h1>
        <ul style="display: {chatActive ? 'block' : 'none'}">
            <li>
                <button on:click={disconnect}><i>Disconnect</i></button>
            </li>
        </ul>
    </nav>

    {#if feedback !== '' && feedback != null}
        <article>
            <aside><p>{feedback}</p></aside>
        </article>
        <br/>
    {/if}
    {#if !chatActive}
        <section>
            <Subscribe onSubscribe={handleSubscribe} bind:login bind:password bind:email />
            <div style="padding-left: 2rem">
                <Login onLogin={handleLogin} bind:login bind:password />
            </div>
        </section>
    {/if}
    <section>
        <Chat chatActive={chatActive} bind:chatInput={chatInput} bind:chatInputValue={chatInputValue} messages={messages} onChatMessage={handleChatMessage} />
    </section>
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: var(--width-content);
        margin: 0 auto;
    }

    ul {
        text-align: left;
    }
</style>