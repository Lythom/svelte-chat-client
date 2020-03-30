import App from './App.svelte';

const SERVER = 'backend.cleverapps.io';
const PROTOCOL = location.protocol;
const WS_PROTOCOL = PROTOCOL === 'https:' ? 'wss:' : 'ws:';

const app = new App({
	target: document.body,
	props: {
		API_SERVER:`${PROTOCOL}//${SERVER}` ,
		WS_SERVER: `${WS_PROTOCOL}//${SERVER}`,
	}
});

export default app;