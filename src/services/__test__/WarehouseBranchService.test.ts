import { WarehouseBranchRepository } from '../../sequelize/WarehouseBranchRepository';
import { WarehouseBranchService } from '../WarehouseBranchService';

export const warehouseBranchRepository = new WarehouseBranchRepository();
export const warehouseBranchService = new WarehouseBranchService(
  warehouseBranchRepository
);

describe('Test WarehouseBranchService Methods', () => {
  describe('some test', () => {
    it('should a test', function () {});
  });
});
