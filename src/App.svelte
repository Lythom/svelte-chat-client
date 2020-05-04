<script>
    import Chat from "./components/Chat.svelte";
    import * as backendAPI from "./api.js"
    import NavBar from "./App/NavBar.svelte";
    import Feedback from "./components/Feedback.svelte";
    import Page1 from "./App/Page1.svelte";
    import About from "./App/About.svelte";
    import LoginSubForms from "./App/LoginSubForms.svelte";
    import Room from "./components/Room.svelte";

    let feedback = '';

    let ws;
    let chatActive = false;
    let connecting = false;

    let page = '/'

    async function autoLogin() {
        connecting = true
        const response = await backendAPI.status()
        const responseValue = await response.text();
        if (responseValue !== 'Visiteur') {
            await connectToChat();
        }
        connecting = false
    }

    async function connectToChat() {
        connecting = true
        feedback = "Connexion au serveur en cours…";
        const ticketResponse = await backendAPI.wsTicket()
        const ticketResponseValue = await ticketResponse.text();
        if (ticketResponse.ok) {
            ws = await backendAPI.startWebsocket(ticketResponseValue, handleWSMessage, disconnect);
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
    let childChatHandler = [];

    // handleWSMessage is called when a message arrive, it is registered as callback on the websocket
    function handleWSMessage(msg) {
        childChatHandler.forEach(handler => handler(msg))
    }

    // this function is given to the Chat component so that it can tell the app what callback function the App should use.
    function subscribeToMessages(handler) {
        childChatHandler.push(handler)
        // a subcription function often return an unsubscription function. Alternatively an "unsubscribe" function can be provided in another way.
        return () => childChatHandler.filter(h => h !== handler)
    }

    //
    //// END of SUBSCRIPTION example

    function navigate(event) {
        // update the url and allow back and forward navigation
        history.pushState(null, event.target.pathname, event.target.pathname)
        changePage(event.target.pathname)
    }

    function changePage(path) {
        page = path
        document.title = 'Chat ' + path
    }

    // window will be null if rendered server side
    if (window != null) {
        // initial configuration
        changePage(window.location.pathname)
        // when the user navigates with prev page
        window.addEventListener('popstate', _ => changePage(window.location.pathname))
    } else {
        // server side, you get the path from the query
    }

    autoLogin();
</script>

<main>
    <NavBar page={page} navigate={navigate} chatActive={chatActive} onLogout={logout}/>

    {#if page === '/'}
        <Feedback feedback={feedback}/>
        {#if !chatActive && !connecting}
            <section>
                <LoginSubForms updateFeedback={fb => feedback = fb} connectToChat={connectToChat}/>
            </section>
        {/if}
        <section class:hide={!chatActive} style="width: 100%;">
            <div class="chat" style="height: calc(100vh - 360px); width: calc(100% - 600px)">
                <Chat subscribeToMessages={subscribeToMessages} sendMessage={sendWSMessage}/>
            </div>
            <aside class="room" style="width: 540px">
                <Room subscribeToMessages={subscribeToMessages} sendMessage={sendWSMessage}/>
            </aside>
        </section>
    {/if}

    {#if page === '/page1'}
        <Page1/>
    {/if}
    {#if page === '/about'}
        <About/>
    {/if}
</main>

<!--suppress CssUnusedSymbol -->
<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: var(--width-content);
        margin: 0 auto;
    }
    .room {
        box-sizing: border-box;
        margin-top: 0;
    }
    .chat {
        box-sizing: border-box;
    }

    .hide {
        display: none;
    }
</style>