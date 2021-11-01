const prod = {
    url: {
        API_URL: 'https://fazztoolsapi.ddns.net',
        REDIRECT_URL: 'https://fazztools.hopto.org'
    }
};

const dev = {
    url: {
        API_URL: 'http://localhost:8000',
        REDIRECT_URL: 'http://localhost:3000'
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;