module.exports = ({ env }) => ({

    'strapi-v5-plugin-populate-deep': {
        config: {
            defaultDepth: 3,
        }
    },
    
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
