import { getTranslations } from 'next-intl/server';

import { Tab } from '@/shared/types/blocks/common';

export interface Setting {
  name: string;
  title: string;
  type: string;
  placeholder?: string;
  options?: {
    title: string;
    value: string;
  }[];
  tip?: string;
  value?: string | string[] | boolean | number;
  group?: string;
  tab?: string;
  attributes?: Record<string, any>;
}

export interface SettingGroup {
  name: string;
  title: string;
  description?: string;
  tab: string;
}

export async function getSettingTabs(tab: string) {
  const t = await getTranslations('admin.settings');

  const tabs: Tab[] = [
    {
      name: 'general',
      title: t('edit.tabs.general'),
      url: '/admin/settings/general',
      is_active: tab === 'general',
    },
    {
      name: 'auth',
      title: t('edit.tabs.auth'),
      url: '/admin/settings/auth',
      is_active: tab === 'auth',
    },
    {
      name: 'payment',
      title: t('edit.tabs.payment'),
      url: '/admin/settings/payment',
      is_active: tab === 'payment',
    },
    {
      name: 'email',
      title: t('edit.tabs.email'),
      url: '/admin/settings/email',
      is_active: tab === 'email',
    },
    {
      name: 'storage',
      title: t('edit.tabs.storage'),
      url: '/admin/settings/storage',
      is_active: tab === 'storage',
    },

    {
      name: 'ai',
      title: t('edit.tabs.ai'),
      url: '/admin/settings/ai',
      is_active: tab === 'ai',
    },
    {
      name: 'analytics',
      title: t('edit.tabs.analytics'),
      url: '/admin/settings/analytics',
      is_active: tab === 'analytics',
    },
    {
      name: 'ads',
      title: t('edit.tabs.ads'),
      url: '/admin/settings/ads',
      is_active: tab === 'ads',
    },
    {
      name: 'affiliate',
      title: t('edit.tabs.affiliate'),
      url: '/admin/settings/affiliate',
      is_active: tab === 'affiliate',
    },
    {
      name: 'customer_service',
      title: t('edit.tabs.customer_service'),
      url: '/admin/settings/customer_service',
      is_active: tab === 'customer_service',
    },
  ];

  return tabs;
}

export async function getSettingGroups() {
  const t = await getTranslations('admin.settings');
  const settingGroups: SettingGroup[] = [
    {
      name: 'appinfo',
      title: t('groups.appinfo'),
      description: t('groups.descriptions.appinfo'),
      tab: 'general',
    },
    {
      name: 'user_role',
      title: t('groups.user_role'),
      description: t('groups.descriptions.user_role'),
      tab: 'general',
    },
    {
      name: 'credit',
      title: t('groups.credit'),
      description: t('groups.descriptions.credit'),
      tab: 'general',
    },
    {
      name: 'email_auth',
      title: t('groups.email_auth'),
      description: t('groups.descriptions.email_auth'),
      tab: 'auth',
    },
    {
      name: 'google_auth',
      title: t('groups.google_auth'),
      description: t('groups.descriptions.google_auth'),
      tab: 'auth',
    },
    {
      name: 'github_auth',
      title: t('groups.github_auth'),
      description: t('groups.descriptions.github_auth'),
      tab: 'auth',
    },
    {
      name: 'basic_payment',
      title: t('groups.basic_payment'),
      description: t('groups.descriptions.basic_payment'),
      tab: 'payment',
    },
    {
      name: 'stripe',
      title: t('groups.stripe'),
      description: t('groups.descriptions.stripe'),
      tab: 'payment',
    },
    {
      name: 'creem',
      title: t('groups.creem'),
      description: t('groups.descriptions.creem'),
      tab: 'payment',
    },
    {
      name: 'paypal',
      title: t('groups.paypal'),
      description: t('groups.descriptions.paypal'),
      tab: 'payment',
    },
    {
      name: 'google_analytics',
      title: t('groups.google_analytics'),
      description: t('groups.descriptions.google_analytics'),
      tab: 'analytics',
    },
    {
      name: 'clarity',
      title: t('groups.clarity'),
      description: t('groups.descriptions.clarity'),
      tab: 'analytics',
    },
    {
      name: 'plausible',
      title: t('groups.plausible'),
      description: t('groups.descriptions.plausible'),
      tab: 'analytics',
    },
    {
      name: 'openpanel',
      title: t('groups.openpanel'),
      description: t('groups.descriptions.openpanel'),
      tab: 'analytics',
    },
    {
      name: 'vercel_analytics',
      title: t('groups.vercel_analytics'),
      description: t('groups.descriptions.vercel_analytics'),
      tab: 'analytics',
    },
    {
      name: 'resend',
      title: t('groups.resend'),
      description: t('groups.descriptions.resend'),
      tab: 'email',
    },
    {
      name: 'r2',
      title: t('groups.r2'),
      description: t('groups.descriptions.r2'),
      tab: 'storage',
    },
    {
      name: 'openrouter',
      title: t('groups.openrouter'),
      description: t('groups.descriptions.openrouter'),
      tab: 'ai',
    },
    {
      name: 'replicate',
      title: t('groups.replicate'),
      description: t('groups.descriptions.replicate'),
      tab: 'ai',
    },
    {
      name: 'fal',
      title: 'Fal',
      description: t('groups.descriptions.fal'),
      tab: 'ai',
    },
    {
      name: 'gemini',
      title: 'Gemini',
      description: t('groups.descriptions.gemini'),
      tab: 'ai',
    },
    {
      name: 'kie',
      title: 'Kie',
      description: t('groups.descriptions.kie'),
      tab: 'ai',
    },
    {
      name: 'adsense',
      title: t('groups.adsense'),
      description: t('groups.descriptions.adsense'),
      tab: 'ads',
    },
    {
      name: 'affonso',
      title: t('groups.affonso'),
      description: t('groups.descriptions.affonso'),
      tab: 'affiliate',
    },
    {
      name: 'promotekit',
      title: t('groups.promotekit'),
      description: t('groups.descriptions.promotekit'),
      tab: 'affiliate',
    },
    {
      name: 'crisp',
      title: t('groups.crisp'),
      description: t('groups.descriptions.crisp'),
      tab: 'customer_service',
    },
    {
      name: 'tawk',
      title: t('groups.tawk'),
      description: t('groups.descriptions.tawk'),
      tab: 'customer_service',
    },
  ];
  return settingGroups;
}

export async function getSettings() {
  const t = await getTranslations('admin.settings');
  const settings: Setting[] = [
    {
      name: 'app_name',
      title: t('fields.app_name.title'),
      placeholder: t('fields.app_name.placeholder'),
      type: 'text',
      group: 'appinfo',
      tab: 'general',
    },
    {
      name: 'app_description',
      title: t('fields.app_description.title'),
      placeholder: t('fields.app_description.placeholder'),
      type: 'textarea',
      group: 'appinfo',
      tab: 'general',
    },
    {
      name: 'app_logo',
      title: t('fields.app_logo.title'),
      type: 'upload_image',
      group: 'appinfo',
      tab: 'general',
    },
    {
      name: 'app_preview_image',
      title: t('fields.app_preview_image.title'),
      type: 'upload_image',
      group: 'appinfo',
      tab: 'general',
    },
    {
      name: 'initial_role_enabled',
      title: t('fields.initial_role_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'user_role',
      tab: 'general',
      tip: t('fields.initial_role_enabled.tip'),
    },
    {
      name: 'initial_role_name',
      title: t('fields.initial_role_name.title'),
      type: 'select',
      value: 'viewer',
      options: [
        { title: t('roles.viewer'), value: 'viewer' },
        { title: t('roles.editor'), value: 'editor' },
        { title: t('roles.admin'), value: 'admin' },
        { title: t('roles.super_admin'), value: 'super_admin' },
      ],
      group: 'user_role',
      tab: 'general',
      tip: t('fields.initial_role_name.tip'),
    },
    {
      name: 'initial_credits_enabled',
      title: t('fields.initial_credits_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'credit',
      tab: 'general',
      tip: t('fields.initial_credits_enabled.tip'),
    },
    {
      name: 'initial_credits_amount',
      title: t('fields.initial_credits_amount.title'),
      type: 'number',
      placeholder: '0',
      group: 'credit',
      tab: 'general',
      tip: t('fields.initial_credits_amount.tip'),
    },
    {
      name: 'initial_credits_valid_days',
      title: t('fields.initial_credits_valid_days.title'),
      type: 'number',
      placeholder: '30',
      group: 'credit',
      tab: 'general',
      tip: t('fields.initial_credits_valid_days.tip'),
    },
    {
      name: 'initial_credits_description',
      title: t('fields.initial_credits_description.title'),
      type: 'text',
      placeholder: 'initial credits for free trial',
      group: 'credit',
      tab: 'general',
      tip: t('fields.initial_credits_description.tip'),
    },
    {
      name: 'email_auth_enabled',
      title: t('fields.email_auth_enabled.title'),
      type: 'switch',
      value: 'true',
      group: 'email_auth',
      tab: 'auth',
    },
    {
      name: 'email_verification_enabled',
      title: t('fields.email_verification_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'email_auth',
      tab: 'auth',
      tip: t('fields.email_verification_enabled.tip'),
    },
    {
      name: 'google_auth_enabled',
      title: t('fields.google_auth_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'google_auth',
      tab: 'auth',
    },
    {
      name: 'google_one_tap_enabled',
      title: t('fields.google_one_tap_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'google_auth',
      tab: 'auth',
    },
    {
      name: 'google_client_id',
      title: t('fields.google_client_id.title'),
      type: 'text',
      placeholder: '',
      group: 'google_auth',
      tab: 'auth',
    },
    {
      name: 'google_client_secret',
      title: t('fields.google_client_secret.title'),
      type: 'password',
      placeholder: '',
      group: 'google_auth',
      tab: 'auth',
    },
    {
      name: 'github_auth_enabled',
      title: t('fields.github_auth_enabled.title'),
      type: 'switch',
      group: 'github_auth',
      tab: 'auth',
    },
    {
      name: 'github_client_id',
      title: t('fields.github_client_id.title'),
      type: 'text',
      placeholder: '',
      group: 'github_auth',
      tab: 'auth',
    },
    {
      name: 'github_client_secret',
      title: t('fields.github_client_secret.title'),
      type: 'password',
      placeholder: '',
      group: 'github_auth',
      tab: 'auth',
    },
    {
      name: 'select_payment_enabled',
      title: t('fields.select_payment_enabled.title'),
      type: 'switch',
      value: 'false',
      tip: t('fields.select_payment_enabled.tip'),
      placeholder: '',
      group: 'basic_payment',
      tab: 'payment',
    },
    {
      name: 'default_payment_provider',
      title: t('fields.default_payment_provider.title'),
      type: 'select',
      value: 'stripe',
      options: [
        {
          title: t('options.stripe'),
          value: 'stripe',
        },
        {
          title: t('options.creem'),
          value: 'creem',
        },
        {
          title: t('options.paypal'),
          value: 'paypal',
        },
      ],
      tip: t('fields.default_payment_provider.tip'),
      group: 'basic_payment',
      tab: 'payment',
    },
    {
      name: 'stripe_enabled',
      title: t('fields.stripe_enabled.title'),
      type: 'switch',
      value: 'false',
      placeholder: '',
      group: 'stripe',
      tab: 'payment',
    },
    {
      name: 'stripe_publishable_key',
      title: t('fields.stripe_publishable_key.title'),
      type: 'text',
      placeholder: 'pk_xxx',
      group: 'stripe',
      tab: 'payment',
    },
    {
      name: 'stripe_secret_key',
      title: t('fields.stripe_secret_key.title'),
      type: 'password',
      placeholder: 'sk_xxx',
      group: 'stripe',
      tab: 'payment',
    },
    {
      name: 'stripe_signing_secret',
      title: t('fields.stripe_signing_secret.title'),
      type: 'password',
      placeholder: 'whsec_xxx',
      tip: t('fields.stripe_signing_secret.tip'),
      group: 'stripe',
      tab: 'payment',
    },
    {
      name: 'stripe_payment_methods',
      title: t('fields.stripe_payment_methods.title'),
      type: 'checkbox',
      tip: t('fields.stripe_payment_methods.tip'),
      options: [
        { title: t('options.card'), value: 'card' },
        { title: t('options.wechat_pay'), value: 'wechat_pay' },
        { title: t('options.alipay'), value: 'alipay' },
      ],
      value: ['card'],
      group: 'stripe',
      tab: 'payment',
    },
    {
      name: 'stripe_promotion_codes',
      title: t('fields.stripe_promotion_codes.title'),
      type: 'textarea',
      attributes: {
        rows: 6,
      },
      placeholder: `{
  "starter": "promo_xxx",
  "standard-monthly": "promo_xxx",
  "premium-yearly": "promo_xxx"
}`,
      group: 'stripe',
      tab: 'payment',
      tip: t('fields.stripe_promotion_codes.tip'),
    },
    {
      name: 'stripe_allow_promotion_codes',
      title: t('fields.stripe_allow_promotion_codes.title'),
      type: 'switch',
      value: 'false',
      group: 'stripe',
      tab: 'payment',
      tip: t('fields.stripe_allow_promotion_codes.tip'),
    },
    {
      name: 'creem_enabled',
      title: t('fields.creem_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'creem',
      tab: 'payment',
    },
    {
      name: 'creem_environment',
      title: t('fields.creem_environment.title'),
      type: 'select',
      value: 'sandbox',
      options: [
        { title: t('options.sandbox'), value: 'sandbox' },
        { title: t('options.production'), value: 'production' },
      ],
      group: 'creem',
      tab: 'payment',
    },
    {
      name: 'creem_api_key',
      title: t('fields.creem_api_key.title'),
      type: 'password',
      placeholder: 'creem_xxx',
      group: 'creem',
      tab: 'payment',
    },
    {
      name: 'creem_signing_secret',
      title: t('fields.creem_signing_secret.title'),
      type: 'password',
      placeholder: 'whsec_xxx',
      group: 'creem',
      tab: 'payment',
      tip: t('fields.creem_signing_secret.tip'),
    },
    {
      name: 'creem_product_ids',
      title: t('fields.creem_product_ids.title'),
      type: 'textarea',
      attributes: {
        rows: 6,
      },
      placeholder: `{
  "starter": "prod_xxx",
  "standard-monthly": "prod_xxx",
  "premium-yearly": "prod_xxx"
}`,
      group: 'creem',
      tab: 'payment',
      tip: t('fields.creem_product_ids.tip'),
    },
    {
      name: 'paypal_enabled',
      title: t('fields.paypal_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_environment',
      title: t('fields.paypal_environment.title'),
      type: 'select',
      value: 'sandbox',
      options: [
        { title: t('options.sandbox'), value: 'sandbox' },
        { title: t('options.production'), value: 'production' },
      ],
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_client_id',
      title: t('fields.paypal_client_id.title'),
      type: 'text',
      placeholder: 'paypal_xxx',
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_client_secret',
      title: t('fields.paypal_client_secret.title'),
      type: 'password',
      placeholder: 'paypal_xxx',
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'paypal_webhook_id',
      title: t('fields.paypal_webhook_id.title'),
      type: 'text',
      placeholder: 'xxx',
      tip: t('fields.paypal_webhook_id.tip'),
      group: 'paypal',
      tab: 'payment',
    },
    {
      name: 'google_analytics_id',
      title: t('fields.google_analytics_id.title'),
      type: 'text',
      placeholder: '',
      group: 'google_analytics',
      tab: 'analytics',
    },
    {
      name: 'clarity_id',
      title: t('fields.clarity_id.title'),
      type: 'text',
      placeholder: '',
      group: 'clarity',
      tab: 'analytics',
    },
    {
      name: 'plausible_domain',
      title: t('fields.plausible_domain.title'),
      type: 'text',
      placeholder: 'hailuo2.site',
      group: 'plausible',
      tab: 'analytics',
    },
    {
      name: 'plausible_src',
      title: t('fields.plausible_src.title'),
      type: 'url',
      placeholder: 'https://plausible.io/js/script.js',
      group: 'plausible',
      tab: 'analytics',
    },
    {
      name: 'openpanel_client_id',
      title: t('fields.openpanel_client_id.title'),
      type: 'text',
      placeholder: '',
      group: 'openpanel',
      tab: 'analytics',
    },
    {
      name: 'vercel_analytics_enabled',
      title: t('fields.vercel_analytics_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'vercel_analytics',
      tab: 'analytics',
    },
    {
      name: 'resend_api_key',
      title: t('fields.resend_api_key.title'),
      type: 'password',
      placeholder: '',
      group: 'resend',
      tab: 'email',
    },
    {
      name: 'resend_sender_email',
      title: t('fields.resend_sender_email.title'),
      type: 'text',
      placeholder: 'hailuo2 Two <no-reply@mail.hailuo2.site>',
      group: 'resend',
      tab: 'email',
    },
    {
      name: 'r2_access_key',
      title: t('fields.r2_access_key.title'),
      type: 'text',
      placeholder: '',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_secret_key',
      title: t('fields.r2_secret_key.title'),
      type: 'password',
      placeholder: '',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_bucket_name',
      title: t('fields.r2_bucket_name.title'),
      type: 'text',
      placeholder: '',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_upload_path',
      title: t('fields.r2_upload_path.title'),
      type: 'text',
      placeholder: 'uploads',
      tip: t('fields.r2_upload_path.tip'),
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_endpoint',
      title: t('fields.r2_endpoint.title'),
      type: 'url',
      placeholder: 'https://<account-id>.r2.cloudflarestorage.com',
      tip: t('fields.r2_endpoint.tip'),
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'r2_domain',
      title: t('fields.r2_domain.title'),
      type: 'url',
      placeholder: '',
      group: 'r2',
      tab: 'storage',
    },
    {
      name: 'openrouter_api_key',
      title: t('fields.openrouter_api_key.title'),
      type: 'password',
      placeholder: 'sk-or-xxx',
      group: 'openrouter',
      tab: 'ai',
    },
    {
      name: 'openrouter_base_url',
      title: t('fields.openrouter_base_url.title'),
      type: 'url',
      placeholder: 'https://openrouter.ai/api/v1',
      tip: t('fields.openrouter_base_url.tip'),
      group: 'openrouter',
      tab: 'ai',
    },
    {
      name: 'replicate_api_token',
      title: t('fields.replicate_api_token.title'),
      type: 'password',
      placeholder: 'r8_xxx',
      group: 'replicate',
      tab: 'ai',
    },
    {
      name: 'replicate_custom_storage',
      title: t('fields.replicate_custom_storage.title'),
      type: 'switch',
      value: 'false',
      group: 'replicate',
      tab: 'ai',
      tip: t('fields.replicate_custom_storage.tip'),
    },
    {
      name: 'fal_api_key',
      title: t('fields.fal_api_key.title'),
      type: 'password',
      placeholder: 'fal_xxx',
      group: 'fal',
      tip: t('fields.fal_api_key.tip'),
      tab: 'ai',
    },
    {
      name: 'fal_custom_storage',
      title: t('fields.fal_custom_storage.title'),
      type: 'switch',
      value: 'false',
      group: 'fal',
      tab: 'ai',
      tip: t('fields.fal_custom_storage.tip'),
    },
    {
      name: 'gemini_api_key',
      title: t('fields.gemini_api_key.title'),
      type: 'password',
      placeholder: 'AIza...',
      group: 'gemini',
      tip: t('fields.gemini_api_key.tip'),
      tab: 'ai',
    },
    {
      name: 'kie_api_key',
      title: t('fields.kie_api_key.title'),
      type: 'password',
      placeholder: 'xxx',
      group: 'kie',
      tip: t('fields.kie_api_key.tip'),
      tab: 'ai',
    },
    {
      name: 'kie_custom_storage',
      title: t('fields.kie_custom_storage.title'),
      type: 'switch',
      value: 'false',
      group: 'kie',
      tab: 'ai',
      tip: t('fields.kie_custom_storage.tip'),
    },
    {
      name: 'adsense_code',
      title: t('fields.adsense_code.title'),
      type: 'text',
      placeholder: 'ca-pub-xxx',
      group: 'adsense',
      tab: 'ads',
    },
    {
      name: 'affonso_enabled',
      title: t('fields.affonso_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'affonso',
      tab: 'affiliate',
    },
    {
      name: 'affonso_id',
      title: t('fields.affonso_id.title'),
      type: 'text',
      placeholder: 'xxx',
      tip: t('fields.affonso_id.tip'),
      group: 'affonso',
      tab: 'affiliate',
    },
    {
      name: 'affonso_cookie_duration',
      title: t('fields.affonso_cookie_duration.title'),
      type: 'number',
      placeholder: '30',
      tip: t('fields.affonso_cookie_duration.tip'),
      value: '30',
      group: 'affonso',
      tab: 'affiliate',
    },
    {
      name: 'promotekit_enabled',
      title: t('fields.promotekit_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'promotekit',
      tab: 'affiliate',
    },
    {
      name: 'promotekit_id',
      title: t('fields.promotekit_id.title'),
      type: 'text',
      placeholder: 'xxx',
      tip: t('fields.promotekit_id.tip'),
      group: 'promotekit',
      tab: 'affiliate',
    },
    {
      name: 'crisp_enabled',
      title: t('fields.crisp_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'crisp',
      tab: 'customer_service',
    },
    {
      name: 'crisp_website_id',
      title: t('fields.crisp_website_id.title'),
      type: 'text',
      placeholder: 'xxx',
      group: 'crisp',
      tab: 'customer_service',
    },
    {
      name: 'tawk_enabled',
      title: t('fields.tawk_enabled.title'),
      type: 'switch',
      value: 'false',
      group: 'tawk',
      tab: 'customer_service',
    },
    {
      name: 'tawk_property_id',
      title: t('fields.tawk_property_id.title'),
      tip: t('fields.tawk_property_id.tip'),
      type: 'text',
      placeholder: 'xxx',
      group: 'tawk',
      tab: 'customer_service',
    },
    {
      name: 'tawk_widget_id',
      title: t('fields.tawk_widget_id.title'),
      type: 'text',
      placeholder: 'xxx',
      group: 'tawk',
      tab: 'customer_service',
    },
  ];

  return settings;
}

// SECURITY: this whitelist gates which DB-stored config keys are allowed to
// reach the browser via `getPublicConfigs()`. Only add keys that are safe to
// expose publicly (feature flags, public client IDs). NEVER add API keys,
// client secrets, signing secrets, or any credential here.
export const publicSettingNames = [
  'email_auth_enabled',
  'email_verification_enabled',
  'google_auth_enabled',
  'google_one_tap_enabled',
  'google_client_id',
  'github_auth_enabled',
  'select_payment_enabled',
  'default_payment_provider',
  'stripe_enabled',
  'creem_enabled',
  'paypal_enabled',
  'affonso_enabled',
  'promotekit_enabled',
  'crisp_enabled',
  'tawk_enabled',
];

export async function getAllSettingNames() {
  const settings = await getSettings();
  const settingNames: string[] = [];

  settings.forEach((setting: Setting) => {
    settingNames.push(setting.name);
  });

  return settingNames;
}
