
import { IProductMovementService } from './../ProductMovementService';
import { IUserService } from './../UserService';
import { IBranchService } from './../BranchService';
import { IProductService } from './../ProductService';
import { IWarehouseService } from './../WarehouseService';
import { IInventoryRepository, IWarehouseBranchRepository, ICheckoutRequestRepository, IProductRepository, IWarehouseAreaRepository, IWarehouseRepository, IInventoryHistoryRepository, IProductMovementRepository, IInspectionResultRepository, IBlockBuyoutReportRepository, ICheckinRequestRepository, IInventoryLogRepository, IUserRepository, IBranchRepository, IConsignmentRepository, IINotificationInternalMarketPlace } from './../contracts';
import { InventoryService, HelperBorrowValidation } from './../InventoryService';
import { ICheckoutRequestApprovalService } from '../CheckoutRequestApprovalService';
import { IWhatsappAndPushNotificationService } from '../WhatsappAndPushNotificationService';
import { IBlockBuyoutReportService } from '../BlockBuyoutReportService';
import { IBorrowService } from '../BorrowService';
import { IBorrowDurationRepository } from '../../sequelize/BorrowDurationRepository';
import { IBorrowBpkbLimitRepository } from '../../sequelize/BorrowBpkbLimitRepository';
import { ConsignmentRepository } from '../../sequelize/ConsignmentRepository';
import { User, Inventory, CheckoutRequestApproval, CheckoutRequest } from '../../models';
import moment from 'moment';
import Constanta from '../../utils/Constanta';


let inventoryService: InventoryService
let inventoryRepository: IInventoryRepository
let warehouseBranchRepository: IWarehouseBranchRepository
let warehouseService: IWarehouseService
let productService: IProductService
let branchService: IBranchService
let userService: IUserService
let productMovementService: IProductMovementService
let checkoutRequestRepository: ICheckoutRequestRepository
let checkoutRequestApprovalService: ICheckoutRequestApprovalService
let whatsappAndPushNotificationService: IWhatsappAndPushNotificationService
let productRepository: IProductRepository
let warehouseAreaRepository: IWarehouseAreaRepository
let warehouseRepository: IWarehouseRepository
let inspectionResultRepository: IInspectionResultRepository
let inventoryHistoryRepository: IInventoryHistoryRepository
let productMovementRepository: IProductMovementRepository
let checkinRequestRepository: ICheckinRequestRepository
let blockBuyoutRepository: IBlockBuyoutReportRepository
let blockBuyoutService: IBlockBuyoutReportService
let inventoryLogRepository: IInventoryLogRepository
let userRepository: IUserRepository
let borrowService: IBorrowService
let borrowDurationRepository : IBorrowDurationRepository
let branchRepository : IBranchRepository
let borrowBpkbLimitRepository: IBorrowBpkbLimitRepository
let consignmentRepository: IConsignmentRepository
let notificationInternalMarketPlace: IINotificationInternalMarketPlace


function getInventoryService(
  {
      inventoryRepository,
      warehouseBranchRepository,
      warehouseService,
      productService,
      branchService,
      userService,
      productMovementService,
      checkoutRequestRepository,
      checkoutRequestApprovalService,
      whatsappAndPushNotificationService,
      productRepository,
      warehouseAreaRepository,
      warehouseRepository,
      inspectionResultRepository,
      inventoryHistoryRepository,
      productMovementRepository,
      checkinRequestRepository,
      blockBuyoutRepository,
      blockBuyoutService,
      inventoryLogRepository,
      userRepository,
      borrowService,
      borrowDurationRepository,
      branchRepository,
      borrowBpkbLimitRepository,
      consignmentRepository
  }: any
) {
  return new InventoryService(
      inventoryRepository,
      warehouseBranchRepository,
      warehouseService,
      productService,
      branchService,
      userService,
      productMovementService,
      checkoutRequestRepository,
      checkoutRequestApprovalService,
      whatsappAndPushNotificationService,
      productRepository,
      warehouseAreaRepository,
      warehouseRepository,
      inspectionResultRepository,
      inventoryHistoryRepository,
      productMovementRepository,
      checkinRequestRepository,
      blockBuyoutRepository,
      blockBuyoutService,
      inventoryLogRepository,
      userRepository,
      borrowService,
      borrowDurationRepository,
      branchRepository,
      borrowBpkbLimitRepository,
      consignmentRepository,
      notificationInternalMarketPlace 
  )
}

beforeEach(() => {
  productRepository = {
    findUserInActivePayment: jest.fn(),
  } as unknown as IProductRepository;

  inventoryService = getInventoryService(
    {
      inventoryRepository,
      warehouseBranchRepository,
      warehouseService,
      productService,
      branchService,
      userService,
      productMovementService,
      checkoutRequestRepository,
      checkoutRequestApprovalService,
      whatsappAndPushNotificationService,
      productRepository,
      warehouseAreaRepository,
      warehouseRepository,
      inspectionResultRepository,
      inventoryHistoryRepository,
      productMovementRepository,
      checkinRequestRepository,
      blockBuyoutRepository,
      blockBuyoutService,
      inventoryLogRepository,
      userRepository,
      borrowService,
      borrowDurationRepository,
      branchRepository,
      borrowBpkbLimitRepository,
      consignmentRepository
    }
  )
})


beforeEach(() => {
  productRepository = {
    findUserInActivePayment: jest.fn(),
  } as unknown as IProductRepository;

  inventoryService = getInventoryService(
    {
      inventoryRepository,
      warehouseBranchRepository,
      warehouseService,
      productService,
      branchService,
      userService,
      productMovementService,
      checkoutRequestRepository,
      checkoutRequestApprovalService,
      whatsappAndPushNotificationService,
      productRepository,
      warehouseAreaRepository,
      warehouseRepository,
      inspectionResultRepository,
      inventoryHistoryRepository,
      productMovementRepository,
      checkinRequestRepository,
      blockBuyoutRepository,
      blockBuyoutService,
      inventoryLogRepository,
      userRepository,
      borrowService,
      borrowDurationRepository,
      branchRepository,
      borrowBpkbLimitRepository
    }
  )
})

describe("InventoryService",() => {
  describe("_getDateMovementDeadlineInventory", () => {
    it("should return null if car warehouse_id , bpkb warehouse_id same and pre garace", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: 4,
        car_last_checkin_warehouse_id: 4,
        transaction_status: 0
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, false)).toBe(null)
    })

    it("should return null if transaction status is true and pre garace", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: null,
        car_last_checkin_warehouse_id: null,
        transaction_status: 1
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, false)).toBe(null)
    })

    it("should return null if transaction status is true and car bpkb difference warehouse and pre garace", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: 4,
        car_last_checkin_warehouse_id: 2,
        transaction_status: 1
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, false)).toBe(null)
    })

    it("should return null if transaction status is true and car bpkb same warehouse and pre garace", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: 4,
        car_last_checkin_warehouse_id: 4,
        transaction_status: 1
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, false)).toBe(null)
    })

    it("should return null if car warehouse_id, bpkb warehouse_id null and pre garace", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: null,
        car_last_checkin_warehouse_id: null,
        transaction_status: 0
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, false)).toBe(null)
    })
    

    it("should return not null if postgrace and all inventory not inwarehouse", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: null,
        car_last_checkin_warehouse_id: null,
        transaction_status: 0
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      const newDate = moment(startGracePeriod) 
      newDate.startOf('day').add(Constanta.DEADLINE_CHECKIN_WHEN_MOVEMENT_DEADLINE_IN_HOUR,'hours')
      const expectDate = newDate.add(Constanta.MOVEMENT_DEADLINE_DAY, 'days').utc().toDate()
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, true)).toStrictEqual(new Date(expectDate))
    })

    it("should return not null if post grace and bpkb in warehouse and car not inwarehouse", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: 4,
        car_last_checkin_warehouse_id: null,
        transaction_status: 0
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      const newDate = moment(startGracePeriod) 
      newDate.startOf('day').add(Constanta.DEADLINE_CHECKIN_WHEN_MOVEMENT_DEADLINE_IN_HOUR,'hours')
      const expectDate = newDate.add(Constanta.MOVEMENT_DEADLINE_DAY, 'days').utc().toDate()
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, true)).toStrictEqual(new Date(expectDate))
    })

    it("should return not null if post grace and car in warehouse and bpkb not inwarehouse", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: null,
        car_last_checkin_warehouse_id: 2,
        transaction_status: 0
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      const newDate = moment(startGracePeriod) 
      newDate.startOf('day').add(Constanta.DEADLINE_CHECKIN_WHEN_MOVEMENT_DEADLINE_IN_HOUR,'hours')
      const expectDate = newDate.add(Constanta.MOVEMENT_DEADLINE_DAY, 'days').utc().toDate()
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, true)).toStrictEqual(new Date(expectDate))
    })

    it("should return not null if post grace and bpkb and car different inwarehouse", () => {
      const inventory = {
        bpkb_last_checkin_warehouse_id: 4,
        car_last_checkin_warehouse_id: 3,
        transaction_status: 0
      } as unknown as Inventory
      const startGracePeriod = new Date("2023-01-01 05:06:03.000")
      const newDate = moment(startGracePeriod) 
      newDate.startOf('day').add(Constanta.DEADLINE_CHECKIN_WHEN_MOVEMENT_DEADLINE_IN_HOUR,'hours')
      const expectDate = newDate.add(Constanta.MOVEMENT_DEADLINE_DAY, 'days').utc().toDate()
      expect(inventoryService._getDateMovementDeadlineInventory(inventory, startGracePeriod, true)).toStrictEqual(new Date(expectDate))
    })

    
  })

  describe("_getDateStartGracePeriod", () => {
    
    it("should return predicted array number 1 if not postgrace and length predicted just 1", () => {
      const predictedGracePeriod = ["2023-01-17T03:31:50.000Z"]
      expect(inventoryService._getDateStartGracePeriod(false, predictedGracePeriod)).toStrictEqual(new Date("2023-01-17T03:31:50.000Z"))
    })
 
    it("should return predicted array number 2 if not postgrace and length predicted is 2", () => {
      const predictedGracePeriod = ["2023-01-17T03:31:50.000Z", "2023-01-19T03:31:50.000Z"]
      expect(inventoryService._getDateStartGracePeriod(false, predictedGracePeriod)).toStrictEqual(new Date("2023-01-19T03:31:50.000Z"))
    })

    it("should return date now if postgrace true", () => {
      const now = new Date("2022-01-19T01:44:11.985Z")
      jest.spyOn(moment, 'utc').mockImplementation(() => {
        return {
          toDate: jest.fn(() => {
            return now
          })
        } as unknown as moment.Moment
      })

      inventoryService = getInventoryService({})
      const predictedGracePeriod = ["2023-01-17T03:31:50.000Z", "2023-01-19T03:31:50.000Z"]
      expect(inventoryService._getDateStartGracePeriod(true, predictedGracePeriod)).toStrictEqual(now)
    })
  })
})


describe('InventoryService', () => {
  it('should throw error if found another helper in active payment', async () => {
    const inventory = {
      user_id: 1,
      republished_product_id: 10
    } as unknown as Inventory;

    const lastCheckoutRequestBy = {
      id: 2
    } as unknown as User;


    productRepository.findUserInActivePayment = jest.fn().mockReturnValue({
      id: 3
    } as unknown as User);
    const validation = new HelperBorrowValidation(productRepository);

    expect(validation.validate({inventory, lastCheckoutRequestBy})).rejects.toThrowError('Items already borrowed by another helper');
  })


  it('should be okay if no republished_product_id', async () => {

    const inventory = {
      user_id: 1
    } as unknown as Inventory;

    const lastCheckoutRequestBy = {
      id: 2
    } as unknown as User;


    productRepository.findUserInActivePayment = jest.fn().mockReturnValue(null);
    const validation = new HelperBorrowValidation(productRepository);

    expect(validation.validate({inventory, lastCheckoutRequestBy})).resolves.toBeUndefined();
  })



  it('should be okay if no other helper in active payment', async () => {

    const inventory = {
      user_id: 1
    } as unknown as Inventory;

    const lastCheckoutRequestBy = {
      id: 2
    } as unknown as User;


    productRepository.findUserInActivePayment = jest.fn().mockReturnValue(null);
    const validation = new HelperBorrowValidation(productRepository);

    expect(validation.validate({inventory, lastCheckoutRequestBy})).resolves.toBeUndefined();
  })

  it('should be okay if auth user is the owner of the inventory', async () => {

    const inventory = {
      user_id: 1
    } as unknown as Inventory;

    const lastCheckoutRequestBy = {
      id: 1
    } as unknown as User;


    productRepository.findUserInActivePayment = jest.fn().mockReturnValue(null);
    const validation = new HelperBorrowValidation(productRepository);

    expect(validation.validate({inventory, lastCheckoutRequestBy})).resolves.toBeUndefined();

  })

  it('should be okay if active payment is the current helper', async () => {

    const inventory = {
      user_id: 1
    } as unknown as Inventory;

    const lastCheckoutRequestBy = {
      id: 2
    } as unknown as User;


    productRepository.findUserInActivePayment = jest.fn().mockReturnValue({
      id: 2
    } as unknown as User);
    const validation = new HelperBorrowValidation(productRepository);

    expect(validation.validate({inventory, lastCheckoutRequestBy})).resolves.toBeUndefined();
  })
})

describe("het Approver Role", () => {
  it("should be able to return the approver owner_manager role", async () => {

    const checkoutRequestApproval: CheckoutRequestApproval = {
      id: 1,
      requested_to_user_id: 1
    } as unknown as CheckoutRequestApproval;

    const checkoutRequest: CheckoutRequest = {
      id: 1, 
      requested_by: 1,
    } as unknown as CheckoutRequest;

    const inventory: Inventory = {
      id: 1,
      user_id: 1
    } as unknown as Inventory;

    userRepository = {
      findHierarchyList: jest.fn()
    } as unknown as IUserRepository;
    inventoryService = getInventoryService({userRepository});

    const result = await inventoryService._getApproverRole(inventory, checkoutRequest, checkoutRequestApproval);
    expect(result).toBe("owner_manager")
    expect(userRepository.findHierarchyList).not.toBeCalled();
  })

  it("should be able to return the approver helper_manager role when requested by helper", async () => {

    const checkoutRequestApproval: CheckoutRequestApproval = {
      id: 1,
      requested_to_user_id: 5
    } as unknown as CheckoutRequestApproval;

    const checkoutRequest: CheckoutRequest = {
      id: 1, 
      requested_by: 2,
    } as unknown as CheckoutRequest;

    const inventory: Inventory = {
      id: 1,
      user_id: 1
    } as unknown as Inventory;


    userRepository = {
      findHierarchyList: jest.fn()
    } as unknown as IUserRepository;

    userRepository.findHierarchyList = jest.fn().mockResolvedValueOnce([
      { id: 1 } as unknown as User,
      { id: 2 } as unknown as User,
      { id: 3 } as unknown as User,
    ]).mockResolvedValueOnce([
      { id: 4 } as unknown as User,
      { id: 5 } as unknown as User,
      { id: 6 } as unknown as User,
    ]);

    inventoryService = getInventoryService({userRepository});


    const result = await inventoryService._getApproverRole(inventory, checkoutRequest, checkoutRequestApproval);
    expect(result).toBe("helper_manager")
    expect(userRepository.findHierarchyList).toBeCalledWith(1);
    expect(userRepository.findHierarchyList).toBeCalledWith(2);

  })


  it("should be able to return the approver owner_manager role when requested by helper", async () => {

    const checkoutRequestApproval: CheckoutRequestApproval = {
      id: 1,
      requested_to_user_id: 2
    } as unknown as CheckoutRequestApproval;

    const checkoutRequest: CheckoutRequest = {
      id: 1, 
      requested_by: 2,
    } as unknown as CheckoutRequest;

    const inventory: Inventory = {
      id: 1,
      user_id: 1
    } as unknown as Inventory;


    userRepository = {
      findHierarchyList: jest.fn()
    } as unknown as IUserRepository;


    userRepository.findHierarchyList = jest.fn().mockResolvedValueOnce([
      { id: 1 } as unknown as User,
      { id: 2 } as unknown as User,
      { id: 3 } as unknown as User,
    ]).mockResolvedValueOnce([
      { id: 4 } as unknown as User,
      { id: 5 } as unknown as User,
      { id: 6 } as unknown as User,
    ]);


    inventoryService = getInventoryService({userRepository});

    const result = await inventoryService._getApproverRole(inventory, checkoutRequest, checkoutRequestApproval);
    expect(result).toBe("owner_manager")
    expect(userRepository.findHierarchyList).toBeCalledWith(1);
  })


  it("should be able to return the approver null  role when requested by helper and approver is not owner or helper superior", async () => {

    const checkoutRequestApproval: CheckoutRequestApproval = {
      id: 1,
      requested_to_user_id: 8
    } as unknown as CheckoutRequestApproval;

    const checkoutRequest: CheckoutRequest = {
      id: 1, 
      requested_by: 2,
    } as unknown as CheckoutRequest;

    const inventory: Inventory = {
      id: 1,
      user_id: 1
    } as unknown as Inventory;

    userRepository.findHierarchyList = jest.fn().mockResolvedValueOnce([
      { id: 1 } as unknown as User,
      { id: 2 } as unknown as User,
      { id: 3 } as unknown as User,
    ]).mockResolvedValueOnce([
      { id: 4 } as unknown as User,
      { id: 5 } as unknown as User,
      { id: 6 } as unknown as User,
    ]);

    const result = await inventoryService._getApproverRole(inventory, checkoutRequest, checkoutRequestApproval);
    expect(result).toBe(null)

  })
})

describe("Get superior ids of aso", () => {
  it("should be able to get superior ids of aso", async () => {
    const userRepository = {
      findHierarchyList: jest.fn().mockResolvedValue([
        {id: 4} as unknown as User,
        {id: 5} as unknown as User,
        {id: 6} as unknown as User,
      ])
    } as unknown as IUserRepository;

    const inventoryService = getInventoryService({userRepository});
    const res = await inventoryService._getSuperiorIds(4)
    expect(res).toEqual([4, 5, 6])
    expect(userRepository.findHierarchyList).toBeCalled()
    expect(userRepository.findHierarchyList).toBeCalledWith(4)
  })

  it("should be able to get superior id for the second times without accessing database", async () => {
    const userRepository = {
      findHierarchyList: jest.fn().mockResolvedValue([
        {id: 4} as unknown as User,
        {id: 5} as unknown as User,
        {id: 6} as unknown as User,
      ])
    } as unknown as IUserRepository;
    const inventoryService = getInventoryService({userRepository});
    const res1 = await inventoryService._getSuperiorIds(4)
    expect(res1).toEqual([4, 5, 6])
    const res2 = await inventoryService._getSuperiorIds(4)
    expect(res2).toEqual([4, 5, 6])
    expect(userRepository.findHierarchyList).toBeCalledTimes(1)

  })
})


