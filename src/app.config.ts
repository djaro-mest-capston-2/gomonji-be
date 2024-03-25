import dotenv from 'dotenv';

dotenv.config();

const env = (key: string, defaultVal: any = undefined) => {
  return process.env[key] || defaultVal;
};

env.require = (key: string, defaultVal: any = undefined) => {
  const value = process.env[key] || defaultVal;
  if (!value) {
    throw new Error(`Environment variable '${key}' is missing!`);
  }

  return value;
};

const config = {
  environment: env.require('NODE_ENV', 'development'),
  app: {
    name: 'octocare-be',
    port: parseInt(env('APP_PORT', 3001)),
    hostname: env('APP_HOSTNAME', '0.0.0.0'),
    host: env(
      'APP_HOST',
      `http://localhost:${parseInt(env('APP_PORT', 3001))}`,
    ),
    api: {
      version: env('APP_API_VERSION', 'api/v3'),
    },
    clientUrl: env.require('APP_CLIENT_URL'),
    legalDocs: [
      {
        filename: 'Code of Conduct for use of OctoCare (annexture) final.pdf',
        uri: 'code-of-conduct',
      },
      {
        filename: 'HCP Terms of Use Agreement for OctoCare v1102.pdf',
        uri: 'terms-of-use',
      },
    ],
    schedule: {
      onCallColor: env('SCHEDULE_ON_CALL_COLOR', '#FEEBE1'),
      onLeaveColor: env('SCHEDULE_ON_LEAVE_COLOR', '#367CFF'),
    },
  },
  legal: {
    issuerName: env('LEGAL_ISSUER_NAME'),
    issuerContactPerson: env('LEGAL_ISSUER_CONTACT_PERSON'),
    issuerEmail: env('LEGAL_ISSUER_EMAIL'),
    issuerContactPersonTitle: env('LEGAL_ISSUER_CONTACT_PERSON_TITLE'),
  },
  db: {
    url: env.require('DATABASE_URL'),
  },

  redis: {
    host: env.require('REDIS_HOST', 'localhost'),
    port: parseInt(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD'),
    cacheTtl: parseInt(env.require('CACHE_TTL')),
  },

  jwt: {
    secret: env.require('JWT_SECRET'),
    signOptions: {
      expiresIn: parseInt(env('JWT_EXPIRES', 30 * 60)),
    },
    refreshTokenExpiresIn: parseInt(
      env(
        'JWT_REFRESH_TOKEN_EXPIRES',
        6 * 60 * 60, // 6 hrs
      ),
    ),
    inviteSecret: env.require('INVITE_SECRET'),
    inviteExpires: env('INVITE_EXPIRES', 24 * 60 * 60),
  },

  messaging: {
    baseUrl: env.require('MESSAGE_GATEWAY_BASE_URL'),
    accessKey: env.require('MESSAGE_GATEWAY_ACCESSKEY'),
    smsCharPerPage: Number(env('MESSAGE_CHAR_PER_PAGE', 160)),
  },


  sentry: {
    dsn: env.require('SENTRY_DSN'),
    debug: env('SENTRY_DEBUG', 'true'),
    tracesSampleRate: 1.0,
  },

  smtp: {
    transport: {
      host: env.require('SMTP_HOST'),
      port: Number(env('SMTP_PORT', 587)),
      secure: env.require('SMTP_SECURE') === 'true',
      auth: {
        user: env('SMTP_USER'),
        pass: env('SMTP_PASSWORD'),
      },
    },
    defaults: {
      from: {
        name: env.require('EMAIL_SENDER_NAME'),
        address: env.require('EMAIL_SENDER_ADDRESS'),
      },
    },
  },

  swagger: {
    user: { demo: env('SWAGGER_USER_PASSWORD', '12345@') },
  },

  aws: {
    S3Region: env.require('AWS_S3_REGION'),
    S3Key: env.require('AWS_S3_ACCESS_KEY_ID'),
    S3Secret: env.require('AWS_S3_ACCESS_KEY_SECRET'),
    S3Bucket: env.require('AWS_S3_BUCKET'),
  },

  tax: {
    VAT: env('VAT_RATE', 0.075),
    WHT: env('WHT_RATE', 0.0),
  },

  octodoc: {
    on_demand_service_id: env(
      'OCTODOC_ON_DEMAND_SERVICE_ID',
      'e9fc9ad6-24a8-4122-9369-e3b1c986f0dd',
    ),
    url: env.require('OCTODOC_URL'),
    token: env.require('OCTODOC_TOKEN'),
    onboard_age_limit: env('OCTODOC_ONBOARD_AGE_LIMIT', '18'),
  },
  transaction_time: {
    MAX_TIME: env('MAX_WAIT', 60000),
    TIME_OUT: env('TIME_OUT', 65000),
  },
  slack: {
    webhookURL: env('SLACK_WEBHOOK_URL'),
    level: Number(env('SLACK_LEVEL', 0)),
  },
  aes_encryption: {
    algorithm: env('AES_ALGORITHM', 'aes-256-cbc'),
    iv: env('AES_IV', '0123456789012345'),
  },
  octoteleweb: {
    timeout: parseInt(env('OCTOTELEWEB_TIMEOUT', 15)),
  },
  queue: {
    max_delay: parseInt(env('QUEUE_MAX_DELAY', 5000)),
  },
};

export default () => config;
