// This configuration file centralizes the webhook URL management.
// It prioritizes an environment variable for production and provides a default for local development.

const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://n8n.atlantia.ai/webhook/4d5f526f-c8ef-4a30-95b9-2070531be80c";

if (!process.env.WEBHOOK_URL) {
    console.warn(
        `[CONFIG] WEBHOOK_URL environment variable is not set. 
        Using default fallback: ${WEBHOOK_URL}. 
        For production, please set the WEBHOOK_URL environment variable.`
    );
}

export { WEBHOOK_URL };