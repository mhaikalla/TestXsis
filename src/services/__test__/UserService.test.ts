import { UserRepository } from '../../sequelize/UserRepository';
import {
  warehouseAreaRepository,
  warehouseAreaService,
} from './WarehouseAreaService.test';
import { UserService } from '../UserService';
import { PasswordHasherMock } from '../../utils/PasswordHasherMock';
import { PasswordGenerator } from '../../utils/PasswordGenerator';
import { OTPGenerator } from '../../utils/OTPGenerator';
import { warehouseRepository, warehouseService } from './WarehouseService.test';
import { regencies, regencyRepository } from './RegencyService.test';
import { roles, userRoleRepository } from './UserRoleService.test';
import { delegatedUsersRepository } from './DelegatedUserService.test';
import {
  User,
  UserCreateAndAssignRequest,
  UserResponse,
  UserRole,
} from '../../models';
import { filter } from 'compression';
import { whatsappAndPushNotificationService } from './WhatsappAndPushNotificationService.test';

const passwordHasher = new PasswordHasherMock();
const passwordGenerator = new PasswordGenerator();
const otpGenerator = new OTPGenerator();

export const userRepository = new UserRepository(warehouseAreaRepository);
export const userService = new UserService(
  passwordHasher,
  userRepository,
  warehouseRepository,
  warehouseAreaRepository,
  passwordGenerator,
  regencyRepository,
  userRoleRepository,
  otpGenerator,
  warehouseService,
  warehouseAreaService,
  delegatedUsersRepository,
  whatsappAndPushNotificationService
);

export const users: UserResponse[] = [
  {
    id: 5654,
    name: 'WC Vira 1',
    address: 'alamat',
    email: 'vira1@gmail.com',
    master_regency_id: '1101',
    master_regency: regencies.find((r) => r.id === '1101') || null,
    branch_id: null,
    id_card_image_url:
      'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/29/1656504434-4806bb7c-b8df-593b-93e4-937a85bb5344.jpeg',
    id_card_selfie_image_url: null,
    phone: '8555666777844',
    profile_picture: null,
    role_id: 455,
    role: roles.find((r) => r.id === 455) || null,
    status: 1,
    created_at: '2022-06-29 19:07:18',
    warehouse_id: null,
    warehouse: null,
    warehouse_area_id: null,
    warehouse_area: null,
    is_working: 1,
    delegated_to: [],
    replaced_by: null,
  },
  {
    id: 5653,
    name: 'WM Vira 1',
    address: 'alamat',
    email: 'vira1@gmail.com',
    master_regency_id: '1201',
    master_regency: regencies.find((r) => r.id === '1201') || null,
    branch_id: null,
    id_card_image_url:
      'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/29/1656504213-4806bb7c-b8df-593b-93e4-937a85bb5344.jpeg',
    id_card_selfie_image_url: null,
    phone: '8555666777123',
    profile_picture: null,
    role_id: 457,
    role: roles.find((r) => r.id === 457) || null,
    status: 1,
    created_at: '2022-06-29 19:03:37',
    warehouse_id: null,
    warehouse: null,
    warehouse_area_id: null,
    warehouse_area: null,
    is_working: 1,
    delegated_to: [],
    replaced_by: null,
  },
  {
    id: 5652,
    name: 'ACM Vira test 3',
    address: 'alamat',
    email: 'vira1@gmail.com',
    master_regency_id: '1202',
    master_regency: regencies.find((r) => r.id === '1202') || null,
    branch_id: null,
    id_card_image_url:
      'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/29/1656496880-4806bb7c-b8df-593b-93e4-937a85bb5344.jpeg',
    id_card_selfie_image_url: null,
    phone: '8555666777122',
    profile_picture: null,
    role_id: 458,
    role: roles.find((r) => r.id === 458) || null,
    status: 1,
    created_at: '2022-06-29 17:01:24',
    warehouse_id: null,
    warehouse: null,
    warehouse_area_id: null,
    warehouse_area: null,
    is_working: 1,
    delegated_to: [],
    replaced_by: null,
  },
  {
    id: 5621,
    name: 'WA Faisal Akmal',
    address: 'Alamat',
    email: 'wafaisalakmal@moladin.com',
    master_regency_id: '1301',
    master_regency: regencies.find((r) => r.id === '1301') || null,
    branch_id: null,
    id_card_image_url:
      'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/29/1656482162-69fb9660-cc54-55f8-a817-8b12c2526662.jpeg',
    id_card_selfie_image_url:
      'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/29/1656482164-69fb9660-cc54-55f8-a817-8b12c2526662.jpeg',
    phone: '81332684003',
    profile_picture: null,
    role_id: 456,
    role: roles.find((r) => r.id === 456) || null,
    status: 1,
    created_at: '2022-06-29 12:56:25',
    warehouse_id: null,
    warehouse: null,
    warehouse_area_id: null,
    warehouse_area: null,
    is_working: 1,
    delegated_to: [],
    replaced_by: null,
  },
  {
    id: 5571,
    name: 'ASO testing Dev 2',
    address: 'dscvfdsv',
    email: 'bimotesting4@gmail.com',
    master_regency_id: '1402',
    master_regency: regencies.find((r) => r.id === '1402') || null,
    branch_id: 57,
    id_card_image_url:
      'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/28/1656405802-38d9c117-1ba5-5bc5-ab76-fddac1c0aaaa.png',
    id_card_selfie_image_url: '',
    phone: '8555777222333',
    profile_picture: null,
    role_id: 361,
    role: roles.find((r) => r.id === 361) || null,
    status: 1,
    created_at: new Date(),
    warehouse_id: null,
    warehouse: null,
    warehouse_area_id: null,
    warehouse_area: null,
    is_working: 1,
    delegated_to: [],
    replaced_by: null,
  },
] as any;

let params: UserCreateAndAssignRequest = {
  address: 'alamat',
  email: 'untitest@moladin.com',
  id_card_image_url:
    'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/29/1656482162-69fb9660-cc54-55f8-a817-8b12c2526662.jpeg',
  id_card_selfie_image_url:
    'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/29/1656482164-69fb9660-cc54-55f8-a817-8b12c2526662.jpeg',
  master_regency_id: 1502,
  name: 'unit test',
  phone: '812332123321',
  profile_picture:
    'https://moladin-evo.s3.ap-southeast-1.amazonaws.com/2022/06/29/1656482164-69fb9660-cc54-55f8-a817-8b12c2526662.jpeg',
  role_id: 456,
  status: 1,
  warehouse_area_id: null,
  warehouse_id: null,
};

export const findUserByRoleDescriptionMock = (description: string) => {
  return users.filter((u) => u?.role?.description === description);
};

describe('Test UserService Methods', () => {
  describe('some test', () => {
    it('should a test', function () {});
  });
});
