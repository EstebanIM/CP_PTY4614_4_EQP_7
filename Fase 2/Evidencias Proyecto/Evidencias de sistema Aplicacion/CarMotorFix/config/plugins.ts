module.exports = ({ env }) => ({
    email: {
        config: {
            provider: 'strapi-provider-email-resend',
            providerOptions: {
                apiKey: env('RESEND_API_KEY'),
            },
            settings: {
                defaultFrom: 'no-reply@diego0alonso.dev',
                defaultReplyTo: 'no-reply@diego0alonso.dev',
            },
        }
    }
});
