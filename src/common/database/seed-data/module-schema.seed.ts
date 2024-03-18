import { faker } from '@faker-js/faker';

const moduleSchema = [
  {
    name: 'Module',
    code: 'core_module',
    moduleName: 'occ',
  },
  {
    name: 'Billing Detail',
    code: 'core_billing_detail',
    moduleName: 'occ',
  },
  {
    name: 'User',
    code: 'core_user',
    moduleName: 'occ',
  },
  {
    name: 'Role',
    code: 'core_role',
    moduleName: 'occ',
  },
  {
    name: 'Branch',
    code: 'core_branch',
    moduleName: 'occ',
  },
  {
    name: 'Building',
    code: 'core_building',
    moduleName: 'occ',
  },
  {
    name: 'Company',
    code: 'core_company',
    moduleName: 'occ',
  },
  {
    name: 'Department',
    code: 'core_department',
    moduleName: 'occ',
  },
  {
    name: 'Patient flow',
    code: 'core_flow',
    moduleName: 'occ',
  },
  {
    name: 'Person',
    code: 'core_person',
    moduleName: 'occ',
  },
  {
    name: 'Service',
    code: 'core_service',
    moduleName: 'occ',
  },
  {
    name: 'Job Role',
    code: 'core_job_role',
    moduleName: 'occ',
  },
  {
    name: 'EMR Patient',
    code: 'emr_patient',
    moduleName: 'emr',
  },
  {
    name: 'Message',
    code: 'core_message',
    moduleName: 'occ',
  },
];

export const moduleSchemaSeed = moduleSchema.map((schema) => ({
  ...schema,
  id: faker.datatype.uuid(),
}));
