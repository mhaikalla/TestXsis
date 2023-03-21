import { BorrowService } from '../BorrowService';
import { BorrowRepository } from '../../sequelize/BorrowRepository';
import {
  inventories,
  inventoryFindByProductIdMockImpl,
  inventoryHistories,
  inventoryRepository,
} from './InventoryService.test';
import { inventoryHistoryService } from './InventoryHistoryService.test';
import {
  warehouseFindByIdMockImpl,
  warehouseRepository,
} from './WarehouseService.test';
import { userRepository } from './UserService.test';
import { whatsappAndPushNotificationService } from './WhatsappAndPushNotificationService.test';
import {
  Borrow,
  BorrowApproval,
  CheckoutRequestApproval,
  Inventory,
  InventoryStatus,
  RequestBorrow,
} from '../../models';
import moment from 'moment-timezone';
import Constanta from '../../utils/Constanta';
import { ApplicationException } from '../../exceptions/ApplicationException';

export const borrowRepository = new BorrowRepository();
export const borrowService = new BorrowService(
  borrowRepository,
  inventoryRepository,
  inventoryHistoryService,
  warehouseRepository,
  userRepository,
  whatsappAndPushNotificationService
);

describe('Test BorrowService Methods', () => {
  describe('when call request() method', () => {
    const param: RequestBorrow = {
      product_id: 19305,
      item_type: 1,
      reason: 'unit test borrow',
      deadline_at: moment()
        .tz(Constanta.TIME_ZONE.ASIA_INDONESIA_JAKARTA)
        .endOf('day')
        .toDate(),
    };

    const requestMock: Borrow = {
      created_at: new Date(),
      deadline_at: param.deadline_at,
      id: 1,
      product_id: param.product_id,
      reason: param.reason,
      requested_at: new Date(),
      updated_at: new Date(),
    };

    describe('negative case', () => {
      it('call with param interface RequestBorrow, and isPending true. Should return throw "Same Pending Request Exists"', async () => {
        const checkIfPendingMock = jest
          .spyOn(borrowRepository, 'checkIfPending')
          .mockResolvedValueOnce(true);

        await expect(() => borrowService.request(param)).rejects.toThrow(
          'Same Pending Request Exists'
        );

        expect(checkIfPendingMock).toHaveBeenCalled();
        expect(checkIfPendingMock).toHaveBeenCalledWith(param.product_id);
      });

      it('call with param interface RequestBorrow, and non existing inventory. Should return throw "Find by product id is not found"', async () => {
        const product_id = 999999;
        jest
          .spyOn(borrowRepository, 'checkIfPending')
          .mockResolvedValueOnce(false);

        await expect(() =>
          borrowService.request({ ...param, product_id })
        ).rejects.toThrow('Find by product id is not found');

        expect(inventoryFindByProductIdMockImpl).toHaveBeenCalled();
        expect(inventoryFindByProductIdMockImpl).toHaveBeenCalledWith(
          product_id
        );
      });

      it('call with param interface RequestBorrow, existing inventory and non existing warehouse. Should return throw "invalid id"', async () => {
        const warehouse_id = 99999;

        jest
          .spyOn(borrowRepository, 'checkIfPending')
          .mockResolvedValueOnce(false);

        const findByProductIdMock = jest
          .spyOn(inventoryRepository, 'findByProductId')
          .mockResolvedValueOnce({ ...inventories[0], warehouse_id });

        await expect(() => borrowService.request(param)).rejects.toThrow(
          'invalid id'
        );

        expect(findByProductIdMock).toHaveBeenCalled();
        expect(findByProductIdMock).toHaveBeenCalledWith(param.product_id);
        expect(warehouseFindByIdMockImpl).toHaveBeenCalled();
        expect(warehouseFindByIdMockImpl).toHaveBeenCalledWith(warehouse_id);
      });

      it('call with param interface RequestBorrow and car_status & bpkp_status not inwarehouse. Should return throw "Fail to update inventory borrow status"', async () => {
        const car_status = Constanta.CAR_STATUS.TRANSIT.NAME as InventoryStatus;
        const bpkb_status = Constanta.CAR_STATUS.TRANSIT
          .NAME as InventoryStatus;

        jest
          .spyOn(borrowRepository, 'checkIfPending')
          .mockResolvedValueOnce(false);

        const borrowRequest = jest
          .spyOn(borrowRepository, 'request')
          .mockResolvedValueOnce(requestMock);

        jest
          .spyOn(inventoryRepository, 'findByProductId')
          .mockResolvedValueOnce({
            ...inventories[0],
          })
          .mockResolvedValueOnce({
            ...inventories[0],
            car_status,
            bpkb_status,
          });

        await expect(() => borrowService.request(param)).rejects.toThrow(
          'Fail to update inventory borrow status'
        );

        expect(inventoryFindByProductIdMockImpl).toHaveBeenCalled();
        expect(inventoryFindByProductIdMockImpl).toHaveBeenCalledWith(
          param.product_id
        );
        expect(warehouseFindByIdMockImpl).toHaveBeenCalled();
        expect(warehouseFindByIdMockImpl).toHaveBeenCalledWith(
          inventories.find((i) => i.product_id === param.product_id)
            ?.warehouse_id
        );
        expect(borrowRequest).toHaveBeenCalled();
        expect(borrowRequest).toHaveBeenCalledWith(param);
      });
    });
    describe('positive case', () => {
      it('call with param item_type 1. Should return true with inventory car_borrow_status PENDING and bpkb_borrow_status null', async () => {
        const item_type = 1;
        const checkoutRequestApprovals: CheckoutRequestApproval[] = [];

        jest
          .spyOn(borrowRepository, 'checkIfPending')
          .mockResolvedValueOnce(false);

        jest
          .spyOn(borrowRepository, 'request')
          .mockResolvedValueOnce(requestMock);

        jest
          .spyOn(borrowRepository, 'requestApprovalCar')
          .mockImplementationOnce(
            async (borrow: BorrowApproval): Promise<void> => {
              const checkoutRequestApproval: CheckoutRequestApproval = {
                checkout_id: borrow.checkout_id,
                concluded_at: null,
                created_at: new Date(),
                doc_link: null,
                id: 1,
                product_movement_id: null,
                reject_reason: borrow.reason,
                requested_item: 'CAR',
                requested_to_user_id: borrow.wm_id,
                status: 'PENDING',
                updated_at: new Date(),
              };
              checkoutRequestApprovals.push(checkoutRequestApproval);
            }
          );

        await expect(
          borrowService.request({ ...param, item_type })
        ).resolves.toBe(true);

        expect(checkoutRequestApprovals.length).toBe(1);

        expect(inventoryHistories.at(-1)?.car_borrow_status).toBe(
          Constanta.CHECKOUT_REQUEST_PENDING
        );
        expect(inventoryHistories.at(-1)?.bpkb_borrow_status).toBe(null);
      });

      it('call with param item_type 2. Should return true with inventory car_borrow_status null and bpkb_borrow_status PENDING', async () => {
        const item_type = 2;
        const checkoutRequestApprovals: CheckoutRequestApproval[] = [];

        jest
          .spyOn(borrowRepository, 'checkIfPending')
          .mockResolvedValueOnce(false);

        jest
          .spyOn(borrowRepository, 'request')
          .mockResolvedValueOnce(requestMock);

        jest
          .spyOn(borrowRepository, 'requestApprovalBPKB')
          .mockImplementationOnce(
            async (borrow: BorrowApproval): Promise<void> => {
              const mappingForWm: CheckoutRequestApproval = {
                checkout_id: borrow.checkout_id,
                concluded_at: null,
                created_at: new Date(),
                doc_link: null,
                id: 1,
                product_movement_id: null,
                reject_reason: borrow.reason,
                requested_item: 'BPKB',
                requested_to_user_id: borrow.wm_id,
                status: 'PENDING',
                updated_at: new Date(),
              };
              const mappingForAcm: CheckoutRequestApproval = {
                checkout_id: borrow.checkout_id,
                concluded_at: null,
                created_at: new Date(),
                doc_link: null,
                id: 2,
                product_movement_id: null,
                reject_reason: borrow.reason,
                requested_item: 'BPKB',
                requested_to_user_id: borrow.acm_id,
                status: 'PENDING',
                updated_at: new Date(),
              };
              checkoutRequestApprovals.push(mappingForWm, mappingForAcm);
            }
          );

        await expect(
          borrowService.request({ ...param, item_type })
        ).resolves.toBe(true);

        expect(checkoutRequestApprovals.length).toBe(2);

        expect(inventoryHistories.at(-1)?.car_borrow_status).toBe(null);
        expect(inventoryHistories.at(-1)?.bpkb_borrow_status).toBe(
          Constanta.CHECKOUT_REQUEST_PENDING
        );
      });

      it('call with param item_type 3. Should return true with inventory car_borrow_status PENDING and bpkb_borrow_status PENDING', async () => {
        const item_type = 3;
        const checkoutRequestApprovals: CheckoutRequestApproval[] = [];

        jest
          .spyOn(borrowRepository, 'checkIfPending')
          .mockResolvedValueOnce(false);

        jest
          .spyOn(borrowRepository, 'request')
          .mockResolvedValueOnce(requestMock);

        jest
          .spyOn(borrowRepository, 'requestApprovalBoth')
          .mockImplementationOnce(
            async (borrow: BorrowApproval): Promise<void> => {
              const carRequest: CheckoutRequestApproval = {
                checkout_id: borrow.checkout_id,
                concluded_at: null,
                created_at: new Date(),
                doc_link: null,
                id: 1,
                product_movement_id: null,
                reject_reason: borrow.reason,
                requested_item: 'CAR',
                requested_to_user_id: borrow.wm_id,
                status: 'PENDING',
                updated_at: new Date(),
              };
              const bpkbRequestForWm: CheckoutRequestApproval = {
                checkout_id: borrow.checkout_id,
                concluded_at: null,
                created_at: new Date(),
                doc_link: null,
                id: 2,
                product_movement_id: null,
                reject_reason: borrow.reason,
                requested_item: 'BPKB',
                requested_to_user_id: borrow.wm_id,
                status: 'PENDING',
                updated_at: new Date(),
              };
              const bpkbRequestForAcm: CheckoutRequestApproval = {
                checkout_id: borrow.checkout_id,
                concluded_at: null,
                created_at: new Date(),
                doc_link: null,
                id: 3,
                product_movement_id: null,
                reject_reason: borrow.reason,
                requested_item: 'BPKB',
                requested_to_user_id: borrow.acm_id,
                status: 'PENDING',
                updated_at: new Date(),
              };
              checkoutRequestApprovals.push(
                carRequest,
                bpkbRequestForWm,
                bpkbRequestForAcm
              );
            }
          );

        await expect(
          borrowService.request({ ...param, item_type })
        ).resolves.toBe(true);

        expect(checkoutRequestApprovals.length).toBe(3);

        expect(inventoryHistories.at(-1)?.car_borrow_status).toBe(
          Constanta.CHECKOUT_REQUEST_PENDING
        );
        expect(inventoryHistories.at(-1)?.bpkb_borrow_status).toBe(
          Constanta.CHECKOUT_REQUEST_PENDING
        );
      });
    });
  });
});
