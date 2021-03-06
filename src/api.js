const SERVER = 'backend.cleverapps.io';
const PROTOCOL = location.protocol;
const WS_PROTOCOL = PROTOCOL === 'https:' ? 'wss:' : 'ws:';
const API_SERVER = `${PROTOCOL}//${SERVER}`;
const WS_SERVER = `${WS_PROTOCOL}//${SERVER}`;

export const USERNAME_SEPARATOR = ' : '
export const MSG_PREFIX = 'msg:'
export const MOV_PREFIX = 'mov:'

export async function startWebsocket(ticket, onMessage, onClose) {
    const ws = new WebSocket(WS_SERVER);
    return new Promise(((resolve) => ws.addEventListener('open', () => {
        ws.send(ticket);
        ws.addEventListener('message', onMessage)
        ws.addEventListener('close', onClose)
        resolve(ws);
    })))
}

export async function wsTicket() {
    return fetch(`${API_SERVER}/wsTicket`, {
        method: 'GET',
        credentials: 'include' // force cookies to be sent even if the remote URL is different from current page
    });
}
export async function logout() {
    return fetch(`${API_SERVER}/logout`, {
        method: 'POST',
        credentials: 'include' // force cookies to be sent even if the remote URL is different from current page
    });
}

export async function login(login, password) {
    return fetch(`${API_SERVER}/login`, {
        method: 'POST',
        body: JSON.stringify({
            "username": login,
            "password": password
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // force cookies to be sent even if the remote URL is different from current page
    });
}

export async function subscribe(login, password, email) {
    return fetch(`${API_SERVER}/subscribe`, {
        method: 'POST',
        body: JSON.stringify({
            "username": login,
            "password": password,
            "email": email,
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // force cookies to be sent even if the remote URL is different from current page
    });
}

export async function status() {
    return fetch(`${API_SERVER}/status`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // force cookies to be sent even if the remote URL is different from current page
    });
}