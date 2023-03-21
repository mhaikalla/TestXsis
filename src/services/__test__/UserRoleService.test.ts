import { UserRoleRepository } from '../../sequelize/UserRoleRepository';
import { UserRoleService } from '../UserRoleService';
import { UserRole } from '../../models';

export const userRoleRepository = new UserRoleRepository();
export const userRoleService = new UserRoleService(userRoleRepository);

export const roles: UserRole[] = [
  {
    id: 361,
    parent_id: null,
    original_name: 'aso',
    name: 'aso',
    description: 'Agent Sales Officer',
    all_resource: 0,
    status: 1,
    created_at: new Date(),
    updated_at: null,
    level: 2,
    product_id: 1,
  },
  {
    id: 455,
    parent_id: null,
    original_name: 'warehouse-coordinator',
    name: 'warehouse-coordinator',
    description: 'Warehouse Coordinator',
    all_resource: 0,
    status: 1,
    created_at: new Date(),
    updated_at: null,
    level: 0,
    product_id: 0,
  },
  {
    id: 456,
    parent_id: null,
    original_name: 'warehouse-admin',
    name: 'warehouse-admin',
    description: 'Warehouse Admin',
    all_resource: 0,
    status: 1,
    created_at: new Date(),
    updated_at: new Date(),
    level: 0,
    product_id: 0,
  },
  {
    id: 457,
    parent_id: null,
    original_name: 'warehouse-manager',
    name: 'warehouse-manager',
    description: 'Warehouse Manager',
    all_resource: 0,
    status: 1,
    created_at: new Date(),
    updated_at: new Date(),
    level: 0,
    product_id: 0,
  },
  {
    id: 458,
    parent_id: null,
    original_name: 'area-control-manager',
    name: 'area-control-manager',
    description: 'Area Control Manager',
    all_resource: 0,
    status: 1,
    created_at: new Date(),
    updated_at: new Date(),
    level: 0,
    product_id: 0,
  },
];

describe('Test UserRoleService Methods', () => {
  describe('some test', () => {
    it('should a test', function () {});
  });
});
