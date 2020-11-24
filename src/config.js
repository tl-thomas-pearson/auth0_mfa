const REDIRECT_URL = 'http://localhost:3000';

export const CONFIG = {
    AUD: '',
    DOMAIN: '',
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    REDIRECT_URL,
};

export default CONFIG;

export const AUTH0_OPTIONS = {
    autoClose: true,
    rememberLastLogin: false,
    sso: true,
    prompt: 'none',
    nonce: 'nonce',
    // needed to allow for refresh_token
    connection_scope: ['offline_access'],
    auth: {
        nonce: 'nonce',
        redirectUrl: REDIRECT_URL,
        responseType: 'code',
        params: {
            nonce: 'nonce',
            scope: 'openid email profile offline_access',
            prompt: 'select_account',
        },
    },
};

export const get_auth_mfa_options = () => {
    const options = { ...AUTH0_OPTIONS };
    options.auth = { ...options.auth };
    options.auth.params = {
        ...options.auth.params,
        mfa_required: true
    };

    return options;
};