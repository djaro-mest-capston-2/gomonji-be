import { PaperFormat, PDFMargin } from 'puppeteer';

export const TRIAGE_MAX_SAFE_INTEGER = 9999;

export enum ResponseMessage {
  SUCCESS = 'Request Successful!',
  FAILED = 'Request Failed!',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface AuthOptions {
  required?: boolean;
}

export interface GenerateSlotOptions {
  serviceId: string;
  userId?: string;
  branchId?: string;
  date: string;
}

export interface ISnomedctConcept {
  conceptId: string;
  active: boolean;
  effectiveTime: string;
  fsn: {
    term: string;
    lang: string;
  };
  pt: {
    term: string;
    lang: string;
  };
  id: string;
}

export interface ISnomedctInboundRelationship {
  active: boolean;
  moduleId: string;
  released: boolean;
  releasedEffectiveTime: number;
  relationshipId: string;
  sourceId: string;
  destinationId: string;
  typeId: string;
}

export type GeneratePdfOptions = {
  margin?: PDFMargin;
  printBackground?: boolean;
  format?: PaperFormat;
};

export type ServiceOperatingHours = {
  openTime: Date;
  closeTime: Date;
};

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  UNKNOWN = 'Unknown',
}

export enum ReferalStatus {
  Active = 'Active',
  Processing = 'Processing',
  Inactive = 'Inactive',
}

export enum RoleType {
  System = 'System',
  Custom = 'Custom',
}

export enum ParentChildOrder {
  Plain = 'plain',
  Hierarchical = 'hierarchical',
}

export enum Depth {
  ParentOnly = 'parentOnly',
  AllChildren = 'allChildren',
}

export enum BuildingType {
  Building = 'Building',
  Wing = 'Wing',
  Floor = 'Floor',
  Ward = 'Ward',
  Room = 'Room',
}

export enum AddressType {
  Physical = 'Physical',
  Postal = 'Postal',
}

export enum AddressPurpose {
  Primary = 'Primary',
  Billing = 'Billing',
  Operational = 'Operational',
  Temporary = 'Temporary',
  Old = 'Old',
}

export enum MessageType {
  Email = 'Email',
  Sms = 'Sms',
  Chat = 'Chat',
}

export enum MessageStatus {
  Pending = 'Pending',
  Cancelled = 'Cancelled',
  Sent = 'Sent',
  Received = 'Received',
  Failed = 'Failed',
  Deleted = 'Deleted',
}

export enum CalendarScheduleType {
  Availability = 'Availability',
  Event = 'Event',
  Task = 'Task',
}

export enum CalendarSchedulePrivacy {
  Public = 'Public',
  Private = 'Private',
  Secret = 'Secret',
}

export enum CalendarScheduleStatus {
  confirmed = 'confirmed',
  cancelled = 'cancelled',
  tentative = 'tentative',
}

export enum AppointmentStatus {
  Proposed = 'Proposed',
  Pending = 'Pending',
  Booked = 'Booked',
  Arrived = 'Arrived',
  CheckedIn = 'CheckedIn',
  InProgress = 'InProgress',
  Fulfilled = 'Fulfilled',
  Cancelled = 'Cancelled',
  NoShow = 'NoShow',
  EnteredInError = 'EnteredInError',
  Waitlist = 'Waitlist',
}

export enum ArrivalOrCheckInOrInProgressAppointmentStatus {
  Arrived = 'Arrived',
  CheckedIn = 'CheckedIn',
  InProgress = 'InProgress',
}

export enum VisitType {
  Initial = 'Initial',
  Return = 'Return',
  Referral = 'Referral',
  External = 'External',
}

export enum AppointmentMode {
  Chat = 'Chat',
  InPerson = 'InPerson',
  Phone = 'Phone',
  Video = 'Video',
  All = 'All',
}

export enum AppSource {
  Dashboard = 'Dashboard',
  Widget = 'Widget',
  Mobile = 'Mobile',
}

export enum CalendarScheduleAvailability {
  Busy = 'Busy',
  Free = 'Free',
  Tentative = 'Tentative',
}

export enum RecurrenceFrequency {
  // secondly = 'secondly',
  // minutely = 'minutely',
  // hourly = 'hourly',
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  yearly = 'yearly',
}

export enum ApprovalStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Published = 'Published',
}

export enum ReminderConditionType {
  DueIn = 'DueIn',
  OverDue = 'OverDue',
}

export enum ContactStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

export enum ContactMembershipStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Inactive = 'Inactive',
}

export enum ReferalRoles {
  Provider = 'Provider',
  Referrer = 'Referrer',
}

export enum MessageState {
  Archived = 'Archived',
  Read = 'Read',
}

export enum EmailProviders {
  SendGrid = 'SendGrid',
  Smtp = 'Smtp',
}

export enum AuthGroups {
  AuthTenant = 'AuthTenant',
  AuthClient = 'AuthClient',
}

export enum PendingOrPast {
  Pending = 'Pending',
  Past = 'Past',
  Booked = 'Booked',
}

export enum MessageTagEntity {
  Appointment = 'Appointment',
  Reminder = 'Reminder',
}

export enum ScheduleType {
  Leave = 'Leave',
  Shift = 'Shift',
  OnCall = 'OnCall',
}

export enum ShiftType {
  Shift = 'Shift',
  Workday = 'Workday',
}

export enum TenantRequestStatus {
  Approved = 'Approved',
  Onboarded = 'Onboarded',
  Pending = 'Pending',
  Processing = 'Processing',
  Rejected = 'Rejected',
}

export enum TenantRequestAction {
  ResendActivationEmail = 'ResendActivationEmail',
}

export enum AccountStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  FinancialHold = 'FinancialHold',
  Inactive = 'Inactive',
}

export enum BrowserEvents {
  DOM_CONTENT_LOADED = 'domcontentloaded',
  LOADED = 'load',
  NETWORK_IDLE = 'networkidle0',
}

export enum MediaTypes {
  SCREEN = 'screen',
  PRINT = 'print',
}

export enum FeeCodes {
  Appointment = 'Appointment',
  Telemedicine = 'Telemedicine',
  Sms = 'Sms',
  EMR = 'EMR',
  Payment = 'Payment',
}

export enum ServiceTypes {
  Service = 'Service',
  Procedure = 'Procedure',
}

export enum WorkPatternItemTypes {
  SHIFT = 'Shift',
  BREAK = 'Break',
}

export enum ClassService {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Tertiary = 'Tertiary',
}

export enum DebitCredit {
  Debit = 'Debit',
  Credit = 'Credit',
}

export enum PasswordStrength {
  NORMAL = 'Normal',
  MEDIUM = 'Medium',
  STRONG = 'Strong',
}

export enum ProviderTypes {
  HOSPITAL = '001',
  CLINIC = '002',
  PHARMACY = '003',
  DIAGNOSTIC_CENTRE = '004',
  DENTAL = '005',
  OPTICAL_OPHTHALMOLOGY = '006',
  PHYSIOTHERAPY = '007',
  MATERNAL_HEALTH = '008',
  EMERGENCY_SERVICE = '009',
  MENTAL_WELLBEING = '010',
  PUBLIC_HEALTH_FACILITY = '011',
  CHILD_CARE = '012',
  GYM_FITNESS_CENTRES = '013',
  TELEMEDICINE = '014',
  OTHERS = '999',
}
