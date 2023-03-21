import { BranchRepository } from '../../sequelize/BranchRepository';
import { BranchService } from '../BranchService';
import { Branch } from '../../models';
import { ApplicationException } from '../../exceptions/ApplicationException';

export const branchRepository = new BranchRepository();
export const branchService = new BranchService(branchRepository);

export const branches: Branch[] = [
  {
    id: 1,
    name: 'Warehouse Bekasi',
    user_id: null,
    master_regencies_id: '3275',
    address: 'Jalan bekasi tambun raya dekat TPA',
    product: 'ucr',
    default_sm: 0,
    status: 1,
    product_id: 1,
    area_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 57,
    name: 'Cabang Ciawi',
    user_id: null,
    master_regencies_id: '3403',
    address: 'Jalan Ciawi',
    product: 'ucr',
    default_sm: 0,
    status: 1,
    product_id: 1,
    area_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 58,
    name: 'Cabang Margonda Depok',
    user_id: 530,
    master_regencies_id: '3276',
    address: 'Jalan Margonda Raya No 3A',
    product: 'ucr',
    default_sm: 0,
    status: 1,
    product_id: 1,
    area_id: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

describe('Test BranchService Methods', () => {
  describe('when call findAll() method', () => {
    it('call without params, should return all branch data', async () => {
      const findByAllMock = jest
        .spyOn(branchRepository, 'findAll')
        .mockResolvedValueOnce(branches);
      await expect(branchService.findAll({})).resolves.toEqual(branches);
      expect(findByAllMock).toHaveBeenCalled();
    });
    it('call with param status unassigned, should return all unassigned branch data', async () => {
      const findByAllMock = jest
        .spyOn(branchRepository, 'findAll')
        .mockResolvedValueOnce(branches);
      await expect(
        branchService.findAll({ status: 'unassigned' })
      ).resolves.toEqual(branches);
      expect(findByAllMock).toHaveBeenCalled();
      expect(findByAllMock).toHaveBeenCalledWith({ status: 'unassigned' });
    });
    it('call with param warehouse_id, should return all assigned from warehouse_id branch data', async () => {
      const findByAllMock = jest
        .spyOn(branchRepository, 'findAll')
        .mockResolvedValueOnce(branches);
      await expect(branchService.findAll({ warehouse_id: 1 })).resolves.toEqual(
        branches
      );
      expect(findByAllMock).toHaveBeenCalled();
      expect(findByAllMock).toHaveBeenCalledWith({ warehouse_id: 1 });
    });
  });

  describe('when call findById() method', () => {
    it('call with param existing id, should return branch data with same id', async () => {
      const id = branches[0].id;
      const branch = branches.find((branch) => branch.id === id) as Branch;
      const findByIdMock = jest
        .spyOn(branchRepository, 'findById')
        .mockResolvedValueOnce(branch);
      const response = await branchService.findById(id);
      expect(response).toEqual(branch);
      expect(response.id).toBe(id);
      expect(findByIdMock).toHaveBeenCalled();
      expect(findByIdMock).toHaveBeenCalledWith(id);
    });
    it('call with param non existing id, should return throw "Branch is not found"', async () => {
      const id = 9999;
      const findByIdMock = jest
        .spyOn(branchRepository, 'findById')
        .mockRejectedValueOnce(
          new ApplicationException('Branch is not found', 'NotFoundError')
        );
      await expect(() => branchService.findById(id)).rejects.toThrow(
        'Branch is not found'
      );
      expect(findByIdMock).toHaveBeenCalled();
      expect(findByIdMock).toHaveBeenCalledWith(id);
    });
  });
});
