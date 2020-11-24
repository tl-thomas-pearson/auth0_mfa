import React, { useState, useEffect } from 'react';
import './App.css';
import { Auth0Lock } from 'auth0-lock';
import qs from 'qs';
import AuthClient from './auth0/client';
import { LoginButton, Button, Code } from './components';
import config, { AUTH0_OPTIONS, get_auth_mfa_options } from "./config";
const { CLIENT_ID, DOMAIN } = config;
const MFA_LOCK_OPTIONS = get_auth_mfa_options();


export default function App() {
    const [ request_response, set_request_response ] = useState('');
    const [{ auth_client, auth_ui, auth_redirect }, set_init_state ] = useState({
        auth_ui: {},
        auth_client: {},
        auth_redirect: {},
    });
    const [{ access_token, refresh_token }, set_auth_tokens ] = useState({
        access_token: '',
        refresh_token: ''
    });

    useEffect(() => {
        const auth_redirect = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        const auth_ui = new Auth0Lock(CLIENT_ID, DOMAIN, AUTH0_OPTIONS);

        const auth_client = new AuthClient(response_logger);
        window.auth_client = auth_client;
        // Check redirect token.
        if(!access_token && auth_redirect?.code) {
            console.log('auth_redirect 🔄', auth_redirect);

            auth_client.get_token(auth_redirect.code, auth_redirect.state)
                .then(set_auth_tokens)
                .catch(set_auth_tokens);
        }

        auth_ui.logout = () => set_auth_tokens({
              auth_token: '',
              refresh_token: '',
        });

        set_init_state({
            auth_ui,
            auth_client,
            auth_redirect
        });

    }, [ access_token ]);

    const response_logger = response => {
        console.log(response);
        set_request_response(JSON.stringify(response, undefined, 2));
    };

    const refresh = async () => {
        if (!auth_client) return;

        const tokens = await auth_client.refresh_token(refresh_token, response_logger);
        set_auth_tokens(tokens);
    };

    const check_mfa = async () => {
        if (!auth_client) return;

        const mfa_token = await auth_client.get_mfa_token(refresh_token, response_logger);
        console.log({ refresh_token,  mfa_token });

        // If no mfa_token the user is still logged in with MFA.
        if(!mfa_token) return;

        auth_client.prompt_mfa(auth_redirect?.state || '');
    };

    const prompt_lock_mfa = () => {
        auth_ui.show(MFA_LOCK_OPTIONS);
    };

    return (
        <div className="App">
            <div>
                <LoginButton
                    isAuthenticated={access_token.length > 0}
                    auth={auth_ui}
                />
                <Button onClick={refresh}>
                   Refresh token
                </Button>
                <Button onClick={check_mfa}>
                    Manual Prompt MFA
                </Button>
                <Button onClick={prompt_lock_mfa}>
                   Auth0 Lock MFA
                </Button>
            </div>
            <Code>
                {request_response}
            </Code>
        </div>
    );
}


