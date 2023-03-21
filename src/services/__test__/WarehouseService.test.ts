import { WarehouseRepository } from '../../sequelize/WarehouseRepository';
import { branches, branchRepository } from './BranchService.test';
import {
  findUserByRoleDescriptionMock,
  userRepository,
  users,
} from './UserService.test';
import { WarehouseService } from '../WarehouseService';
import { villageRepository } from './VillageService.test';
import { districtRepository } from './DistrictService.test';
import { warehouseBranchRepository } from './WarehouseBranchService.test';
import { Warehouse, WarehouseAreaExtend } from '../../models';
import { ApplicationException } from '../../exceptions/ApplicationException';

export const warehouseRepository = new WarehouseRepository(
  branchRepository,
  userRepository
);
export const warehouseService = new WarehouseService(
  branchRepository,
  villageRepository,
  districtRepository,
  warehouseRepository,
  warehouseBranchRepository,
  userRepository
);

const acmMock = findUserByRoleDescriptionMock('Area Control Manager');

export const warehouses: Warehouse[] = [
  {
    id: 31,
    name: 'WH VIRA 1',
    address: 'alamat',
    regency_id: '1101',
    district_id: '1101010',
    village_id: '1101010001',
    post_code: 21323,
    warehouse_area_id: null,
    is_assigned: true,
    manager_user_id: 103512,
    status: 'ACTIVE',
    coordinator_user_id: 103511,
    capacity: 0,
    operating_days: [
      1,
      2,
      3,
      4,
      5,
      6,
      {
        end: 61200,
        start: 28800,
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
    warehouse_admins: [],
    warehouse_area: null,
    warehouse_manager: users.find(
      (u) => u?.role?.description === 'Warehouse Manager'
    ),
    branches: [branches[0]],
    warehouse_coordinator: null,
  },
  {
    id: 30,
    name: 'Warehouse Bersama',
    address: 'Alamat Tesssss',
    regency_id: '1101',
    district_id: '1101010',
    village_id: '1101010001',
    post_code: null,
    warehouse_area_id: 23,
    is_assigned: true,
    manager_user_id: findUserByRoleDescriptionMock('Warehouse Manager')[0].id,
    status: 'ACTIVE',
    coordinator_user_id: null,
    capacity: 24,
    operating_days: [
      1,
      2,
      3,
      4,
      5,
      6,
      {
        end: 79200,
        start: 33300,
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
    warehouse_admins: [],
    warehouse_area: {
      id: 23,
      name: 'Area WMS Temporary',
      is_assigned: true,
      created_at: new Date(),
      updated_at: new Date(),
      acm_user_id: acmMock.length ? acmMock[0].id : null,
    },
    branches: [branches[1], branches[2]],
    warehouse_coordinator: null,
  },
  {
    id: 29,
    name: 'warehouse lama',
    address: 'warehouse',
    regency_id: '1101',
    district_id: '1101010',
    village_id: '1101010001',
    post_code: null,
    warehouse_area_id: null,
    is_assigned: false,
    manager_user_id: null,
    status: 'ACTIVE',
    coordinator_user_id: 103267,
    capacity: 4,
    operating_days: [
      1,
      2,
      3,
      4,
      5,
      6,
      {
        end: 0,
        start: 0,
      },
    ],
    created_at: new Date(),
    updated_at: new Date(),
    warehouse_admins: [],
    warehouse_area: null,
    branches: [branches[3]],
    warehouse_coordinator: users.find(
      (u) => u?.role?.description === 'Warehouse Coordinator'
    ),
  },
] as any;

export const warehouseAreas: WarehouseAreaExtend[] = [
  {
    id: 23,
    name: 'Area WMS Temporary',
    is_assigned: true,
    created_at: new Date(),
    updated_at: new Date(),
    acm_user_id: acmMock.length ? acmMock[0].id : null,
    area_warehouse_manager: acmMock.length ? acmMock[0] : null,
    warehouses: [warehouses[0]],
  },
  {
    id: 22,
    name: 'Area Wholesale Booster Efficiency',
    is_assigned: false,
    created_at: new Date(),
    updated_at: new Date(),
    acm_user_id: null,
    area_warehouse_manager: null,
    warehouses: [warehouses[1]],
  },
];

export const warehouseFindByIdMockImpl = jest
  .spyOn(warehouseRepository, 'findById')
  .mockImplementation(async (id: number): Promise<Warehouse> => {
    const warehouse = warehouses.find((w) => w.id === id);
    if (!warehouse) {
      throw new ApplicationException('invalid id', 'InputParameterError');
    }
    return warehouse;
  });

describe('Test WarehouseService Methods', () => {
  describe('some test', () => {
    it('should a test', function () {
      console.log(warehouses[0].branches);
    });
  });
});
