import { DatatypeModule } from '@faker-js/faker';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import crypto from 'node:crypto';
import axios from 'axios';
import bcrypt from 'bcrypt';
import { isNumberString } from 'class-validator';
// import Base64 from 'crypto-js/enc-base64';
// import sha256 from 'crypto-js/sha256';
import { PhoneNumberUtil } from 'google-libphonenumber';
import _ from 'lodash';
import moment from 'moment';
import { customAlphabet } from 'nanoid';
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import {
  BrowserEvents,
  GeneratePdfOptions,
  ISnomedctConcept,
  ISnomedctInboundRelationship,
  MediaTypes,
} from './common/interfaces';

const CUSTOM_CHARS =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class AppUtilities {
  public static async generatePdfFromUrl(
    url: string,
    options?: GeneratePdfOptions,
  ): Promise<Buffer> {
    // if (Array.isArray(url)) {
    //   return Promise.all(
    //     url.map((url) => AppUtilities.generatePdf({ url, options })),
    //   );
    // }
    return this.generatePdf({ url, options });
  }

  public static async generatePdfFromHtml(
    html: string,
    options?: GeneratePdfOptions,
  ): Promise<Buffer> {
    // if (Array.isArray(html)) {
    //   return Promise.all(
    //     html.map((content) =>
    //       AppUtilities.generatePdf({ html: content, options }),
    //     ),
    //   );
    // }
    return this.generatePdf({ html, options });
  }

  public static generateShortCode(charLen = 6): string {
    const nanoid = customAlphabet(CUSTOM_CHARS, charLen);

    return nanoid();
  }

  public static generateUniqueKey(): string {
    return uuidv4();
  }

  // public static signMessage(message: string): string {
  //   return Base64.stringify(sha256(message));
  // }

  public static getSystemDate(): Date {
    return new Date();
  }

  public static getRegionCodeForNumber(phone: string) {
    const phoneUtil = PhoneNumberUtil.getInstance();
    return phoneUtil.getRegionCodeForNumber(phoneUtil.parse(phone));
  }

  public static unflatten = (flattedObject: any) => {
    const result = [];
    _.keys(flattedObject).forEach(function (key) {
      key.split('|').forEach((path, resultIndex) => {
        _.set(result, `[${resultIndex}].${path}`, flattedObject[key]);
      });
    });
    return result;
  };

  public static encode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data).toString(encoding);
  }

  public static decode(
    data: string,
    encoding: BufferEncoding = 'base64',
  ): string {
    return Buffer.from(data, encoding).toString();
  }

  public static resolveAllDayOperatingHours(date: string, endDate?: string) {
    const mStartDate = moment.parseZone(date);
    const mEndDate = moment.parseZone(endDate || date);

    return {
      openTime: mStartDate.startOf('day').toDate(),
      closeTime: mEndDate.endOf('day').toDate(),
    };
  }

  public static getClientAppUrl(
    uri?: string,
    query?: Record<string, string | number>,
  ): string {
    const url = new URL(uri ?? '', process.env.APP_CLIENT_URL);
    !!query &&
      Object.entries(query).forEach(([key, val]) => {
        url.searchParams.append(key, String(val));
      });

    return url.toString();
  }

  public static compileSnomedctConceptRelations = async <
    T = Record<string, any>,
  >(
    uuidGenerator: DatatypeModule,
    conceptId: string,
    partOf?: string,
    baseConceptId?: string,
    extras?: T,
  ) => {
    const concept: ISnomedctConcept =
      await AppUtilities.fetchConceptDetails(conceptId);
    if (!concept) {
      return [];
    }

    let iRelations = [];
    const relations = [
      {
        id: uuidGenerator.uuid(),
        name: concept.pt.term,
        code: conceptId,
        partOf: baseConceptId !== partOf ? partOf && partOf : undefined,
        ...extras,
      },
    ];
    const inboundRelationships =
      await AppUtilities.fetchConceptInboundRelationships(conceptId);
    if (inboundRelationships?.length) {
      iRelations = await Promise.all(
        inboundRelationships.map(({ sourceId }) =>
          AppUtilities.compileSnomedctConceptRelations(
            uuidGenerator,
            sourceId,
            conceptId,
            baseConceptId,
            extras,
          ),
        ),
      );
    }

    return iRelations.length ? relations.concat(...iRelations) : relations;
  };

  public static getCachePrefix() {
    return `${process.env.NODE_ENV}.${process.env.APP_NAME}`;
  }

  public static handleException(error: any): Error {
    console.error(AppUtilities.requestErrorHandler(error));
    const errorCode: string = error.code;
    const message: string = error.meta
      ? error.meta.cause
        ? error.meta.cause
        : error.meta.field_name
          ? error.meta.field_name
          : error.meta.column
            ? error.meta.table
            : error.meta.table
      : error.message;
    switch (errorCode) {
      case 'P0000':
      case 'P2003':
      case 'P2004':
      case 'P2015':
      case 'P2018':
      case 'P2025':
        return new NotFoundException(message);
      case 'P2005':
      case 'P2006':
      case 'P2007':
      case 'P2008':
      case 'P2009':
      case 'P2010':
      case 'P2011':
      case 'P2012':
      case 'P2013':
      case 'P2014':
      case 'P2016':
      case 'P2017':
      case 'P2019':
      case 'P2020':
      case 'P2021':
      case 'P2022':
      case 'P2023':
      case 'P2026':
      case 'P2027':
        return new BadRequestException(message);
      case 'P2024':
        return new RequestTimeoutException(message);
      case 'P0001':
        return new UnauthorizedException(message);
      case 'P2002':
        const msg = `Conflict Exception: '${error.meta?.target?.[0]}' already exists!`;
        return new ConflictException(error.meta?.target?.[0] ? msg : message);
      default:
        console.error(message);
        if (!!message && message.toLocaleLowerCase().includes('arg')) {
          return new BadRequestException(
            'Invalid/Unknown field was found in the data set!',
          );
        } else {
          return error;
        }
    }
  }

  public static async hashAuthSecret(secret: string) {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(secret, salt);
  }

  public static async validatePassword(
    password: string,
    hashedPassword: string,
  ) {
    return bcrypt.compare(password, hashedPassword);
  }

  public static removeExtraSpacesAndLowerCase(item: string) {
    return item
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  public static isAuthGroupAuthorized(
    sessionAuthGroups: string[],
    tokenAuthGroups: string[],
  ) {
    let groupAuthorized = false;
    for (const groupAuth of sessionAuthGroups) {
      if (tokenAuthGroups.includes(groupAuth)) {
        groupAuthorized = true;
        break;
      }
    }

    return groupAuthorized;
  }

  public static requestErrorHandler = (response: any = {}) => {
    const {
      message: errorMessage,
      response: serverResp,
      isCancel,
      isNetwork,
      config,
    } = response;

    let message = errorMessage,
      data: any = {},
      isServerError = false;

    if (serverResp?.data) {
      isServerError = true;
      message =
        serverResp.data?.error ||
        serverResp.data?.message ||
        'Unexpected error occurred!';
      data =
        typeof serverResp.data === 'object'
          ? { ...serverResp.data }
          : { data: serverResp.data };
      delete data.message;
    } else if (isCancel) {
      message = 'Request timed out.';
    } else if (isNetwork) {
      message = 'Network not available!';
    }

    const errorData = {
      message,
      isServerError,
      ...(isServerError && {
        data: {
          ...data,
          errorMessage,
          api: {
            method: config?.method,
            url: config?.url,
            baseURL: config?.baseURL,
          },
        },
      }),
    };

    return errorData;
  };

  public static removeSensitiveData(
    data: any,
    deleteKeys: any,
    remove?: boolean,
  ) {
    if (typeof data != 'object') return; // if data not object
    if (!data) return; // null object

    for (const key in data) {
      if (deleteKeys.includes(key)) {
        remove ? delete data[key] : (data[key] = '******************');
      } else {
        AppUtilities.removeSensitiveData(data[key], deleteKeys); // recursive to check inner object
      }
    }
    return data;
  }

  public static encryptData(
    data: string,
    algorithm: string,
    key: string,
    iv: string,
  ) {
    try {
      const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(key),
        Buffer.from(iv),
      );
      let encrypted = cipher.update(data);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return encrypted.toString('hex');
    } catch (error) {
      console.error(error.message);
    }
  }

  public static decryptData(
    data: string,
    algorithm: string,
    key: string,
    iv: string,
  ) {
    try {
      const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(key),
        Buffer.from(iv),
      );
      let decrypted = decipher.update(Buffer.from(data, 'hex'));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      console.error(error.message);
    }
  }

  public static generateSecretKey(): string {
    const key = this.generateUniqueKey().split('-').join('');

    return this.encode(key);
  }

  private static async generatePdf({
    html,
    url,
    options,
  }: {
    html?: string;
    url?: string;
    options?: GeneratePdfOptions;
  }) {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    if (html) {
      await page.setContent(html, {
        waitUntil: BrowserEvents.NETWORK_IDLE,
      });
    } else if (url) {
      await page.goto(url, { waitUntil: BrowserEvents.LOADED });
    }

    await page.emulateMediaType(MediaTypes.SCREEN);
    const pdf = await page.pdf(options);
    // close
    browser.close();

    return pdf;
  }

  private static fetchConceptDetails = async (
    id: string,
  ): Promise<ISnomedctConcept> => {
    const snowstormBaseURL = process.env.SNOWSTORM_BASE_URL;
    const snomedctBranch = process.env.SNOMEDCT_BRANCH;
    if (!snowstormBaseURL) {
      throw new Error('process.env.SNOWSTORM_BASE_URL is invalid or missing.');
    }
    if (!snomedctBranch) {
      throw new Error('process.env.SNOMEDCT_BRANCH is invalid or missing.');
    }

    return axios
      .get(`${snowstormBaseURL}/${snomedctBranch}/concepts/${id}`)
      .then((data) => data.data);
  };

  private static fetchConceptInboundRelationships = async (
    id: string,
  ): Promise<ISnomedctInboundRelationship[]> => {
    const snowstormBaseURL = process.env.SNOWSTORM_BASE_URL;
    const snomedctBranch = process.env.SNOMEDCT_BRANCH;
    if (!snowstormBaseURL) {
      throw new Error('process.env.SNOWSTORM_BASE_URL is invalid or missing.');
    }
    if (!snomedctBranch) {
      throw new Error('process.env.SNOMEDCT_BRANCH is invalid or missing.');
    }

    return axios
      .get(
        `${snowstormBaseURL}/${snomedctBranch}/concepts/${id}/inbound-relationships`,
      )
      .then((data) => data.data?.inboundRelationships || []);
  };
}
