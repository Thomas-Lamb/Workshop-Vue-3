let server = { "qbv2_url" : import.meta.env.VITE_APP_QBV2_URL,
    "qbv2_proxy" : import.meta.env.VITE_APP_QBV2_ECHO_PROXY,
    "qbv2_port": import.meta.env.VITE_APP_QBV2_ECHO_PROXY === true ? ':' +  import.meta.env.VITE_APP_QBV2_ECHO_PORT : '',
};

export default server;
