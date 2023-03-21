import { WarehouseAreaRepository } from '../../sequelize/WarehouseAreaRepository';
import { WarehouseAreaService } from '../WarehouseAreaService';
import { warehouseRepository } from './WarehouseService.test';
import { findUserByRoleDescriptionMock, users } from './UserService.test';

export const warehouseAreaRepository = new WarehouseAreaRepository();
export const warehouseAreaService = new WarehouseAreaService(
  warehouseAreaRepository,
  warehouseRepository
);

// const acmMock = findUserByRoleDescriptionMock('Area Control Manager');

//
// export const warehouseAreas: WarehouseAreaExtend[] = [
//   {
//     id: 23,
//     name: 'Area WMS Temporary',
//     is_assigned: true,
//     created_at: new Date(),
//     updated_at: new Date(),
//     acm_user_id: acmMock.length ? acmMock[0].id : null,
//     area_warehouse_manager: acmMock.length ? acmMock[0] : null,
//     warehouses: [warehouses[0]],
//   },
//   {
//     id: 22,
//     name: 'Area Wholesale Booster Efficiency',
//     is_assigned: false,
//     created_at: new Date(),
//     updated_at: new Date(),
//     acm_user_id: null,
//     area_warehouse_manager: null,
//     warehouses: [warehouses[1]],
//   },
// ];

describe('Test WarehouseAreaService Methods', () => {
  describe('some test', () => {
    it('should a test', function () {});
  });
});
