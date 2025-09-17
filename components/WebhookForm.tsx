import React from 'react';

interface WebhookFormProps {
  url: string;
  setUrl: (url: string) => void;
  isDisabled: boolean;
}

const WebhookForm: React.FC<WebhookFormProps> = ({ url, setUrl, isDisabled }) => {
  return (
    <div className="w-full">
      <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 mb-1">
        Webhook URL
      </label>
      <input
        type="url"
        id="webhook-url"
        name="webhook-url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={isDisabled}
        placeholder="Enter your webhook URL here"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#8345BA] focus:border-[#8345BA] transition-all disabled:opacity-50"
        aria-describedby="webhook-url-description"
      />
      <p className="mt-2 text-xs text-gray-500" id="webhook-url-description">
        The structured JSON analysis will be sent to this endpoint.
      </p>
    </div>
  );
};

export default WebhookForm;
