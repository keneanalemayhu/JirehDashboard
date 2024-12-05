export default {
    async redirects() {
        return [
            {
                source: '/', // Match the root path
                destination: '/auth/login', // Redirect to the login page
                permanent: true, // Set true for 301 (permanent) or false for 302 (temporary)
            },
        ];
    },
};
