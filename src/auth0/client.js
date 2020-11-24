import axios from "axios";
import qs from "qs";
import config from "../config";

const {DOMAIN, CLIENT_ID, AUD, REDIRECT_URL, CLIENT_SECRET} = config;

export default class AuthClient {
    constructor(response_logger = () => {
    }) {
        this.client = axios.create({
            baseURL: `https://${DOMAIN}`,
        });

        this.response_logger = response_logger;
    }

    // use refresh_token to refresh access_token.
    refresh_token(refresh_token = '') {
        console.log('refresh_token: ', refresh_token);

        return this.client.post(`/oauth/token`, qs.stringify({
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            refresh_token
        })).then(({data}) => {
            console.log('Successful token refresh 🙌');
            this.response_logger(data);

            return {
                access_token: data?.access_token || '',
                refresh_token: data?.refresh_token || '',
            };
        }).catch(err => {
            this.response_logger(err?.response);

            return {
                access_token: '',
                refresh_token: '',
            };
        });
    }

    // 1) get client auth code to request tokens.
    // same as auth_ui.login with connection_scopes = ['offline']
    get_code_with_refresh_token(state = '') {
        const params = qs.stringify({
            audience: AUD,
            scope: 'openid email profile offline_access',
            response_type: 'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URL,
            state
        });

        window.open(`https://${DOMAIN}/authorize?${params}`);
    }

    // 2) get token id_token & refresh_toke from auth code.
    get_token(code = '', state = '') {
        return this.client.post(`/oauth/token`, qs.stringify({
            grant_type: 'authorization_code',
            response_type: 'token id_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URL,
            code,
            state
        })).then(({data}) => {
            console.log('Successful redirect 🙌');
            this.response_logger(data);
            return {
                access_token: data?.access_token || '',
                refresh_token: data?.refresh_token || '',
            };
        })
            .catch(err => {
                this.response_logger(err?.response);
                return {
                    access_token: '',
                    refresh_token: '',
                };
            });
    }

    // 3) use refresh_token to check against mfa scope.
    get_mfa_token(refresh_token = '') {
        return this.client.post(`/oauth/token`, qs.stringify({
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URL,
            refresh_token,
            mfa_required: true,
        })).then(({data}) => {
            console.log('Successful login with mfa 🙌');
            this.response_logger(data);
            return '';
        }).catch(err => {
            const response = err?.response || {};
            this.response_logger(response);

            const mfa_token = response?.data?.mfa_token;
            console.error(err, response, mfa_token);
            return mfa_token;
        });
    }

    prompt_mfa(state = '') {
        const params = qs.stringify({
            audience: AUD,
            scope: 'openid email profile', //offline_access',
            response_type: 'token id_token',//'code',
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URL,
            nonce: 'nonce',
            prompt: 'mfa',
            mfa_required: true,
            state,
        });

        window.open(`https://${DOMAIN}/authorize?${params}`);
    }
}
