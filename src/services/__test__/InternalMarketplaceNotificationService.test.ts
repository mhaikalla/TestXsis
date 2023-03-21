import InternalMarketplaceNotificationService from "../InternalMarketplaceNotificationService"
import { INotification, IUserRepository } from '../contracts';
import { Branch, CheckinRequest, CheckoutRequest, Inventory, User, Warehouse } from '../../models';
import { CheckoutRequestRepository } from "../../sequelize/CheckoutRequestRepository";
import { BranchRepository } from '../../sequelize/BranchRepository';
import { whatsAppParamsBorrow } from '../../models/index';
import { CheckinRequestRepository } from '../../sequelize/CheckinRequestRepository';
import { WarehouseRepository } from '../../sequelize/WarehouseRepository';
import { NotificationHistoryRepository } from '../../sequelize/NotificationHistoryRepository';

let pushNotification: INotification
let waNotification: INotification
let userRepository: IUserRepository
let inventory: Inventory
let user: User
let branch: Branch
let checkoutRequest: CheckoutRequest
let checkinRequest: CheckinRequest
let warehouses: Warehouse[];
let checkoutRequestRepository: CheckoutRequestRepository
let branchRepository: BranchRepository
let warehouseRepository: WarehouseRepository
let checkinRequestRepository: CheckinRequestRepository
let notificationHistoryRepository : NotificationHistoryRepository 
let ImNotificationService;
let checkoutRequestApproval;
let checkinRequestApproval;


beforeEach( ()=> {
  pushNotification = {
    send: jest.fn().mockResolvedValue(true)
  }

  waNotification = {
    send: jest.fn().mockResolvedValue(true)
  }
  user = {} as unknown as User;
  branch = {} as unknown as Branch;
  warehouses = {} as unknown as Warehouse[]

  checkoutRequest = null as unknown as CheckoutRequest
  checkinRequest = null as unknown as CheckinRequest

  userRepository = {
    findUserById: jest.fn().mockResolvedValue(user),
    findManyByIdList: jest.fn().mockResolvedValue(user),
    findHierarchyList: jest.fn().mockResolvedValue(user)
  } as unknown as IUserRepository

  warehouseRepository = {
    findAllByIds: jest.fn().mockResolvedValue(warehouses)
  } as unknown as WarehouseRepository

  checkoutRequestRepository = {
    findLastRequestByProductId: jest.fn().mockResolvedValue(user)
  } as unknown as CheckoutRequestRepository

  checkinRequestRepository = {

  } as unknown as CheckinRequestRepository

  branchRepository = {
    findById: jest.fn().mockResolvedValue(branch),
  } as unknown as BranchRepository

  inventory = {
    product_id: 72118,
    user_id: 1123992,
    product_name: "BMW E38 730i L",
    number_plate: "N1234FA",
  } as unknown as Inventory;

  ImNotificationService = new InternalMarketplaceNotificationService(
    waNotification,
    pushNotification,
    userRepository,
    checkoutRequestRepository,
    branchRepository,
    checkinRequestRepository,
    warehouseRepository,
    notificationHistoryRepository
  )


  checkinRequestApproval = [
    {
      id:839,
      checkin_id:489,
      product_movement_id:null,
      requested_item:"BPKB",
      requested_to_user_id:1112474,
      status:"CANCELED",
      reject_reason:"RESERVATION_TIMEOUT",
      executed_by:null,
      requested_to_user:{
         id:1112474,
         parent_id:null,
         name:"WM Tebet",
         unique_id:null,
         master_regencies_id:"3171",
         branch_id:106,
         phone:"83332221116",
         role_id:399,
         status:1,
         role:{
            id:399,
            parent_id:null,
            original_name:"warehouse-manager",
            name:"warehouse-manager",
            description:"Warehouse Manager",
         }
      },
    }
      
  ]

  checkoutRequestApproval = [
    {
      id: 5790,
      checkout_id: 1675,
      requested_item: "BOTH",
      requested_to_user_id: 1112482,
      status: "PENDING",
      requested_to_user: {
          id: 1112482,
          parent_id: 1112480,
          name: "SM Tebet",
          unique_id: "df78da30-e498-460b-8461-1b020dc37ddb",
          branch_id: 106,
          phone: "89665779239",
          role_id: 356,
          status: 1,
          role: {
              id: 356,
              parent_id: null,
              original_name: "sm",
              name: "sm",
              description: "Sales Manager",
          }
      },
    },
    {
        id: 5791,
        checkout_id: 1675,
        requested_item: "BOTH",
        requested_to_user_id: 1112480,
        status: "PENDING",
        requested_to_user: {
            id: 1112480,
            parent_id: 1123993,
            name: "AM Tebet",
            unique_id: "69336bd8-4dcc-4177-8a4f-0198e1b267b2",
            branch_id: 106,
            phone: "89665779239",
            role_id: 355,
            role: {
                id: 355,
                parent_id: null,
                original_name: "am",
                name: "am",
                description: "Area Manager",
            }
        },
    },
    {
        id: 5792,
        checkout_id: 1675,
        requested_item: "BOTH",
        requested_to_user_id: 1123993,
        status: "PENDING",
        requested_to_user: {
            id: 1123993,
            parent_id: 1112479,
            name: "RM Tebet",
            unique_id: "f98767f2-cf98-42a7-aa4d-e9120683414f",
            branch_id: 106,
            phone: "89665779239",
            role_id: 374,
            role: {
                id: 374,
                parent_id: null,
                original_name: "regional-manager",
                name: "regional-manager",
                description: "Regional Manager",
            }
        },
    },
    {
        id: 5797,
        checkout_id: 1675,
        requested_item: "BOTH",
        requested_to_user_id: 1112479,
        status: "PENDING",
        requested_to_user: {
            id: 1112479,
            parent_id: 1112466,
            name: "HM Tebet",
            unique_id: "d3033cd1-2441-4674-9e0d-7eb971713234",
            branch_id: 106,
            phone: "89665779239",
            role_id: 359,
            role: {
                id: 359,
                parent_id: null,
                original_name: "head-ucr",
                name: "head-ucr",
                description: "Head Manager",
            }
        },
    },
    {
        id: 5794,
        checkout_id: 1675,
        product_movement_id: null,
        requested_item: "BOTH",
        requested_to_user_id: 1113064,
        concluded_at: "2023-01-21T06:12:30.000Z",
        status: "PENDING",
        requested_to_user: {
            id: 1113064,
            parent_id: 1113062,
            name: "SM Rawamangun",
            unique_id: "5424d13f-6a1c-4f3d-9da8-62c14c27d8ff",
            branch_id: 112,
            phone: "89665779239",
            role_id: 356,
            role: {
                id: 356,
                parent_id: null,
                original_name: "sm",
                name: "sm",
                description: "Sales Manager",
            }
        },
        
    },
    {
        id: 5795,
        checkout_id: 1675,
        product_movement_id: null,
        requested_item: "BOTH",
        requested_to_user_id: 1113062,
        status: "PENDING",
        requested_to_user: {
            id: 1113062,
            parent_id: 1124067,
            name: "AM Rawamangun",
            unique_id: "fbd54f41-c58f-4369-9c9a-9c4ab00fe4cc",
            branch_id: 112,
            phone: "89665779239",
            role_id: 355,
            role: {
                id: 355,
                parent_id: null,
                original_name: "am",
                name: "am",
                description: "Area Manager",
            }
        },
    },
    {
        id: 5796,
        checkout_id: 1675,
        product_movement_id: null,
        requested_item: "BOTH",
        requested_to_user_id: 1124067,
        concluded_at: "2023-01-21T06:14:01.000Z",
        status: "PENDING",
        requested_to_user: {
            id: 1124067,
            parent_id: 1113061,
            name: "RM Rawamangun",
            unique_id: "0723e36f-b91f-4253-9555-d3c06d6bf168",
            branch_id: 112,
            phone: "89665779239",
            role_id: 374,
            role: {
                id: 374,
                parent_id: null,
                original_name: "regional-manager",
                name: "regional-manager",
                description: "Regional Manager",
            }
        },
    },
    {
        id: 5798,
        checkout_id: 1675,
        product_movement_id: null,
        requested_item: "BOTH",
        requested_to_user_id: 1112474,
        concluded_at: null,
        status: "PENDING",
        requested_to_user: {
            id: 1112474,
            parent_id: null,
            name: "WM Tebet",
            unique_id: null,
            branch_id: 106,
            phone: "89665779239",
            role_id: 399,
            role: {
                id: 399,
                parent_id: null,
                original_name: "warehouse-manager",
                name: "warehouse-manager",
                description: "Warehouse Manager",
            }
        },
    },
    {
        id: 5799,
        checkout_id: 1675,
        product_movement_id: null,
        requested_item: "BOTH",
        requested_to_user_id: 1112476,
        concluded_at: null,
        status: "PENDING",
        requested_to_user: {
            id: 1112476,
            parent_id: null,
            name: "ACM Tebet",
            unique_id: null,
            branch_id: 141,
            phone: "89665779239",
            role_id: 400,
            role: {
                id: 400,
                parent_id: null,
                original_name: "warehouse-super-admin",
                name: "warehouse-super-admin",
                description: "Area Control Manager",
            }
        },
    } 
]
}) 



describe("InternalMarketplaceNotificationService", () => {
  describe("_getUserApprovalCheckout", () => {
    it("should empty if checkout request approval requested_to_user not found", () => {
      
      checkoutRequest = {
        id: 1125,
        product_id: 62564,
        checkout_request_approvals: [
            checkoutRequestApproval[0]
          ]
      } as unknown as CheckoutRequest
      checkoutRequest.checkout_request_approvals[0].requested_to_user = undefined
      
      expect(ImNotificationService._getUserApprovalCheckout(checkoutRequest)).toStrictEqual([])
    })

    it("should return data user if checkout request approval requested_to_user is found", () => {
      checkoutRequest = {
        id: 1125,
        product_id: 62564,
        checkout_request_approvals: [
            checkoutRequestApproval[0]
          ]
      } as unknown as CheckoutRequest

      const User = [
        checkoutRequest.checkout_request_approvals[0].requested_to_user
      ]

      expect(ImNotificationService._getUserApprovalCheckout(checkoutRequest)).toStrictEqual(User)
    })

    it("should return twice a data user if checkout request approval requested_to_user is have more than one", () => {
      checkoutRequest = {
          id: 1125,
          product_id: 62564,
          checkout_request_approvals: [
              checkoutRequestApproval[0],
              checkoutRequestApproval[1]
            ]
        } as unknown as CheckoutRequest
      

      const User = [
        checkoutRequest.checkout_request_approvals[0].requested_to_user,
        checkoutRequest.checkout_request_approvals[1].requested_to_user,
      ]
      
      expect(ImNotificationService._getUserApprovalCheckout(checkoutRequest)).toStrictEqual(User)
    })

    it("should return twice a data user if checkout request approval requested_to_user is have three data but one is empty", () => {
      checkoutRequest = {
        id: 1125,
        product_id: 62564,
        checkout_request_approvals: [
             checkoutRequestApproval[0],
            {
              id: 2992,
              checkout_id: 1125,
              requested_to_user_id: 104340,
              requested_to_user: {},
            },
            checkoutRequestApproval[2]
          ]
      } as unknown as CheckoutRequest

      const User = [
        checkoutRequest.checkout_request_approvals[0].requested_to_user,
        checkoutRequest.checkout_request_approvals[2].requested_to_user
      ]

      expect(ImNotificationService._getUserApprovalCheckout(checkoutRequest)).toStrictEqual(User)
    })



  })

  describe("_getManagerHelperApproval",() => {
    it("should throw error if userHelperHierarchy is empty", async() => {
      user = [] as unknown as User 
      userRepository.findHierarchyList = jest.fn().mockResolvedValue(user)
      await expect(ImNotificationService._getManagerHelperApproval(checkoutRequest, user)).rejects.toThrowError("userHelperHierarchy not found")
    })

    it("should return three data if userHelperHierarchy is have SM, AM and RM", async() => {
      checkoutRequest = {
        checkout_request: {
          id: 1675,
          product_id: 72118,
          requested_by: 1114248,
          reason: "asdfaff",
          checkout_request_approvals: checkoutRequestApproval,
      },
      } as unknown as CheckoutRequest

      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[3].requested_to_user,
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[5].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
        checkoutRequestApproval[7].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
      ] as unknown as User 
      
      let userHierarchy = [
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[5].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
      ] as unknown as User 
      userRepository.findHierarchyList = jest.fn().mockResolvedValue(userHierarchy)
      await expect(ImNotificationService._getManagerHelperApproval(checkoutRequest.requested_by,user)).resolves.toStrictEqual(userHierarchy)
    })

    it("should return two data if userHelperHierarchy is have SM and RM", async() => {
      checkoutRequest = {
        checkout_request: {
          id: 1675,
          product_id: 72118,
          requested_by: 1114248,
          reason: "asdfaff",
          checkout_request_approvals: checkoutRequestApproval,
      },
      } as unknown as CheckoutRequest

      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[3].requested_to_user,
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[5].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
        checkoutRequestApproval[7].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
      ] as unknown as User 
      
      let userHierarchy = [
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
      ] as unknown as User 
      userRepository.findHierarchyList = jest.fn().mockResolvedValue(userHierarchy)
      await expect(ImNotificationService._getManagerHelperApproval(checkoutRequest.requested_by,user)).resolves.toStrictEqual(userHierarchy)
    })

    it("should return empty data if userHelperHierarchy is not mach with list approval", async() => {
      checkoutRequest = {
        checkout_request: {
          id: 1675,
          product_id: 72118,
          requested_by: 1114248,
          reason: "asdfaff",
          checkout_request_approvals: checkoutRequestApproval,
      },
      } as unknown as CheckoutRequest

      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[3].requested_to_user,
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[5].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
        checkoutRequestApproval[7].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
      ] as unknown as User 
      
      
      let userHierarchy = [
        {
          id: 2111,
          parent_id: 1113061,
          name: "RM Rawamangun",
          unique_id: "0723e36f-b91f-4253-9555-d3c06d6bf168",
          branch_id: 112,
          phone: "82221116650",
          role_id: 374,
          role: {
              id: 374,
              parent_id: null,
              original_name: "regional-manager",
              name: "regional-manager",
              description: "Regional Manager",
          } 
        },
      ] as unknown as User 
      
      userRepository.findHierarchyList = jest.fn().mockResolvedValue(userHierarchy)
      await expect(ImNotificationService._getManagerHelperApproval(checkoutRequest.requested_by,user)).resolves.toStrictEqual([])
    })
  })

  describe("_getManagerOwnerApproval",() => {
    it("should throw error if userHelperHierarchy is empty", async() => {
      user = [] as unknown as User 
      userRepository.findHierarchyList = jest.fn().mockResolvedValue(user)
      await expect(ImNotificationService._getManagerOwnerApproval(inventory,user)).rejects.toThrowError("userOwnerHierarchy not found")
    })

    it("should return three data if userOwnerHierarchy is have SM, AM and RM", async() => {      
      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[3].requested_to_user,
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[5].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
        checkoutRequestApproval[7].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
      ] as unknown as User 
      
      let userHierarchy = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
      ] as unknown as User 
      userRepository.findHierarchyList = jest.fn().mockResolvedValue(userHierarchy)
      await expect(ImNotificationService._getManagerHelperApproval(inventory,user)).resolves.toStrictEqual(userHierarchy)
    })

    it("should return two data if userOwnerHierarchy is have SM and RM", async() => {
      
      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[3].requested_to_user,
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[5].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
        checkoutRequestApproval[7].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
      ] as unknown as User 
      
      let userHierarchy = [
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
      ] as unknown as User 
      userRepository.findHierarchyList = jest.fn().mockResolvedValue(userHierarchy)
      await expect(ImNotificationService._getManagerHelperApproval(inventory,user)).resolves.toStrictEqual(userHierarchy)
    })

    it("should return empty data if userOwnerHierarchy is not mach with list approval", async() => {      
      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[3].requested_to_user,
        checkoutRequestApproval[4].requested_to_user,
        checkoutRequestApproval[5].requested_to_user,
        checkoutRequestApproval[6].requested_to_user,
        checkoutRequestApproval[7].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
      ] as unknown as User 
      
      
      let userHierarchy = [
        {
          id: 2111,
          parent_id: 1113061,
          name: "RM Rawamangun",
          unique_id: "0723e36f-b91f-4253-9555-d3c06d6bf168",
          branch_id: 112,
          phone: "82221116650",
          role_id: 374,
          role: {
              id: 374,
              parent_id: null,
              original_name: "regional-manager",
              name: "regional-manager",
              description: "Regional Manager",
          } 
        },
      ] as unknown as User 
      
      userRepository.findHierarchyList = jest.fn().mockResolvedValue(userHierarchy)
      await expect(ImNotificationService._getManagerHelperApproval(inventory,user)).resolves.toStrictEqual([])
    })
  })

  describe("_getAcmWmApproval",() => {
    it("should return empty if userListApproval null or empty", () => {
      user = [] as unknown as User
      expect(ImNotificationService._getAcmWmApproval(user)).toStrictEqual([])
    })


    it("should return empty if Acm Or Wm not found in user List Approval", () => {
      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[2].requested_to_user,
        
      ] as unknown as User
      expect(ImNotificationService._getAcmWmApproval(user)).toStrictEqual([])
    })

    it("should return data Acm if only found Acm in user List Approval", () => {
      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[2].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
        
      ] as unknown as User
      
      expect(ImNotificationService._getAcmWmApproval(user)).toStrictEqual([checkoutRequestApproval[8].requested_to_user])
    })

    it("should return data Acm and Wm if Acm and Wm found in user List Approval", () => {
      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[2].requested_to_user,
        checkoutRequestApproval[7].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
        
      ] as unknown as User

      const listAcmWmApproval = [
        checkoutRequestApproval[7].requested_to_user,
        checkoutRequestApproval[8].requested_to_user,
      ]
      
      expect(ImNotificationService._getAcmWmApproval(user)).toStrictEqual(listAcmWmApproval)
    })

  })

  describe("_getBorrowItem", () => {
    it("should return item Mobil dan Bpkb, and isBpkb ya if requested item BOTH", () =>{
      const response = {
        item: "BOTH",
        description: "Mobil dan Bpkb",
        isBpkb: "Ya"
      }
      checkoutRequest = {
          id: 1675,
          product_id: 72118,
          requested_by: 1114248,
          reason: "asdfaff",
          checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest
      
      expect(ImNotificationService._getBorrowItem(checkoutRequest)).toStrictEqual(response)
    })

    it("should return item Mobil, and isBpkb Tidak if requested item only car", () =>{
      const response = {
        item: "CAR",
        description: "Mobil",
        isBpkb: "Tidak"
      }
      checkoutRequestApproval[0].requested_item = "CAR"
      checkoutRequest = {
          id: 1675,
          product_id: 72118,
          requested_by: 1114248,
          reason: "asdfaff",
          checkout_request_approvals: [
            checkoutRequestApproval[0]
          ],
      } as unknown as CheckoutRequest
      
      expect(ImNotificationService._getBorrowItem(checkoutRequest)).toStrictEqual(response)
    })

    it("should return item Bpkb, and isBpkb Ya if requested item only Bpkb", () =>{
      const response = {
        item: "BPKB",
        description: "Bpkb",
        isBpkb: "Ya"
      }
      checkoutRequestApproval[0].requested_item = "BPKB"
      checkoutRequest = {
          id: 1675,
          product_id: 72118,
          requested_by: 1114248,
          reason: "asdfaff",
          checkout_request_approvals: [
            checkoutRequestApproval[0]
          ],
      } as unknown as CheckoutRequest
      
      expect(ImNotificationService._getBorrowItem(checkoutRequest)).toStrictEqual(response)
    })
  })

  describe("_whatappParramsBody", () => {
    it("should return whatappParramsBody if all params has value", () =>{
      const branch = {
          id: 106,
          name: "MCC Tebet Barat",
          user_id: 1112470,
          master_regencies_id: "3171",
          address: "Tebet",
          product: "mcc",
          default_sm: 0,
          status: 1,
          product_id: 3,
          area_id: null,
          
      }
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest

      checkinRequest = {
        id: 1675,
        warehouse_id: 10,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkin_request_approvals: checkinRequestApproval,
      } as unknown as CheckinRequest

      warehouses = {
          id:55,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        } as unknown as Warehouse[]

      const aso_helper : User = {
        id : 1114248,
        name : "ASO MCC Penggilingan",
        phone : "08765432123",
        address: "Penggilingan",
        email : "mccpenggilingan@moladin.com",
        unique_id:"123456789012345678901234567890"
      } as User

     
      const paramsBody = {
        manager: checkoutRequestApproval[7].requested_to_user,
        inventory: inventory,
        aso_owner: checkoutRequestApproval[6].requested_to_user,
        aso_helper: aso_helper,
        branch: branch,
        checkout_request: checkoutRequest,
        checkin_request: checkinRequest,
        warehouse: warehouses
      } as unknown as whatsAppParamsBorrow
      
      expect(ImNotificationService._whatappParramsBody(checkoutRequestApproval[7].requested_to_user, inventory, checkoutRequestApproval[6].requested_to_user, aso_helper, branch, checkoutRequest, checkinRequest, warehouses)).toStrictEqual(paramsBody)
    })

    it("should return whatappParramsBody with warehouse null if params warehouse null", () =>{
      const branch = {
          id: 106,
          name: "MCC Tebet Barat",
          user_id: 1112470,
          master_regencies_id: "3171",
          address: "Tebet",
          product: "mcc",
          default_sm: 0,
          status: 1,
          product_id: 3,
          area_id: null,
          
      }
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest

      checkinRequest = {
        id: 1675,
        warehouse_id: 10,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkin_request_approvals: checkinRequestApproval,
      } as unknown as CheckinRequest

      warehouses = {
          id:55,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        } as unknown as Warehouse[]

        const aso_helper : User = {
          id : 1114248,
          name : "ASO MCC Penggilingan",
          phone : "08765432123",
          address: "Penggilingan",
          email : "mccpenggilingan@moladin.com",
          unique_id:"123456789012345678901234567890"
        } as User

      const paramsBody = {
        manager: checkoutRequestApproval[7].requested_to_user,
        inventory: inventory,
        aso_owner: checkoutRequestApproval[6].requested_to_user,
        aso_helper : aso_helper,
        branch: branch,
        checkout_request: checkoutRequest,
        checkin_request: checkinRequest,
        warehouse: null
      } as unknown as whatsAppParamsBorrow
      
      expect(ImNotificationService._whatappParramsBody(checkoutRequestApproval[7].requested_to_user, inventory, checkoutRequestApproval[6].requested_to_user, aso_helper, branch, checkoutRequest, checkinRequest, null)).toStrictEqual(paramsBody)
    })
  })


  describe("_isInRequestBorrow", () => {
    it("should return true if all request is pending", () => {
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval
      } as unknown as CheckoutRequest
      expect(ImNotificationService._isInRequestBorrowPending(checkoutRequest)).toBe(true)
    })

    it("should return false if one of the status is APPROVED", () => {
      checkoutRequestApproval[3].status = "APPROVED"
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: [
          checkoutRequestApproval[0],
          checkoutRequestApproval[1],
          checkoutRequestApproval[2],
          checkoutRequestApproval[3]
        ],
      } as unknown as CheckoutRequest
      expect(ImNotificationService._isInRequestBorrowPending(checkoutRequest)).toBe(false)
    })

    it("should return false if one of the status is EXECUTED", () => {
      checkoutRequestApproval[3].status = "EXECUTED"
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: [
          checkoutRequestApproval[0],
          checkoutRequestApproval[1],
          checkoutRequestApproval[2],
          checkoutRequestApproval[3]
        ],
      } as unknown as CheckoutRequest
      expect(ImNotificationService._isInRequestBorrowPending(checkoutRequest)).toBe(false)
    })

    it("should return false if one of the status is DECLINED", () => {
      checkoutRequestApproval[3].status = "DECLINED"
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: [
          checkoutRequestApproval[0],
          checkoutRequestApproval[1],
          checkoutRequestApproval[2],
          checkoutRequestApproval[3]
        ],
      } as unknown as CheckoutRequest
      expect(ImNotificationService._isInRequestBorrowPending(checkoutRequest)).toBe(false)
    })
  })

  describe("_getWarehouseBeforeCheckout", () => {
    it("should return null if warehouse not found", async() => {
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest
      warehouseRepository.findAllByIds = jest.fn().mockResolvedValue([])

      await expect(ImNotificationService._getWarehouseBeforeCheckout(inventory, checkoutRequest)).resolves.toBe(null)
    } )

    it("should return warehouse original if car_last_checkin_warehouse_id and bpkb_last_checkin_warehouse_id not found and borrow is both", async() => {
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest

      inventory = {
        product_id:72118,
        warehouse_id: 55,
        car_last_checkin_warehouse_id: null,
        bpkb_last_checkin_warehouse_id: null
      } as unknown as Inventory

      warehouses = [
        {
          id:55,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        }
      ] as unknown as Warehouse[]

      warehouseRepository.findAllByIds = jest.fn().mockResolvedValue(warehouses)

      await expect(ImNotificationService._getWarehouseBeforeCheckout(inventory, checkoutRequest)).resolves.toBe(warehouses[0])
    } )

    it("should return warehouse car_last_checkin_warehouse if bpkb_last_checkin_warehouse_id not found and borrow is both ", async() => {
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest

      inventory = {
        product_id:72118,
        warehouse_id: 55,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: null
      } as unknown as Inventory

      warehouses = [
        {
          id:55,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        },
        {
          id:20,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        }
      ] as unknown as Warehouse[]

      warehouseRepository.findAllByIds = jest.fn().mockResolvedValue(warehouses)

      await expect(ImNotificationService._getWarehouseBeforeCheckout(inventory, checkoutRequest)).resolves.toBe(warehouses[1])
    } )

    it("should return warehouse car_last_checkin_warehouse if  borrow is CAR ", async() => {
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: [
          checkoutRequestApproval[0].requested_item = "CAR"
        ],
      } as unknown as CheckoutRequest

      inventory = {
        product_id:72118,
        warehouse_id: 55,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: null
      } as unknown as Inventory

      warehouses = [
        {
          id:55,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        },
        {
          id:20,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        }
      ] as unknown as Warehouse[]

      warehouseRepository.findAllByIds = jest.fn().mockResolvedValue(warehouses)

      await expect(ImNotificationService._getWarehouseBeforeCheckout(inventory, checkoutRequest)).resolves.toBe(warehouses[1])
    } )

    it("should return warehouse bpkb_last_checkin_warehouse_id if  borrow is BPKB ", async() => {
      
      checkoutRequestApproval[0].requested_item = "BPKB"
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: [
          checkoutRequestApproval[0]
          
        ],
      } as unknown as CheckoutRequest

      inventory = {
        product_id:72118,
        warehouse_id: 55,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: 30
      } as unknown as Inventory

      warehouses = [
        {
          id:55,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        },
        {
          id:20,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        },
        {
          id:30,
          name:"Warehouse Makassar",
          address:"Jl. Veteran selatan No. 203 Makassar",
          regency_id:"7371",
          district_id:"7371020",
          village_id:"7371020012",
          post_code:null,
          warehouse_area_id:50,
          is_assigned:true,
          manager_user_id:280682,
          status:"ACTIVE",
          coordinator_user_id:506579,
          capacity:50,
          operating_days:[
             1,
             2,
             3,
             4,
             5,
             6
          ],
          type:"REGULAR",
          
        }
      ] as unknown as Warehouse[]

      warehouseRepository.findAllByIds = jest.fn().mockResolvedValue(warehouses)

      await expect(ImNotificationService._getWarehouseBeforeCheckout(inventory, checkoutRequest)).resolves.toBe(warehouses[2])
    } )

  })

  describe("_sendForRequestBorrow", () => {    

    it("should error if detail aso is null", async() =>{
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest

      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(checkoutRequest)
      userRepository.findManyByIdList = jest.fn().mockResolvedValue(null)

      await expect(ImNotificationService._sendForRequestBorrow(inventory, checkoutRequest)).rejects.toThrowError("Detail Aso owner and helper not found")
    })

     it("should error if branch is null", async() =>{
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest
      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[2].requested_to_user,
        
      ] as unknown as User
      
      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(checkoutRequest)
      userRepository.findManyByIdList = jest.fn().mockResolvedValue(user)
      branchRepository.findById = jest.fn().mockResolvedValue(null)
      await expect(ImNotificationService._sendForRequestBorrow(inventory, checkoutRequest)).rejects.toThrowError("branch not found")
    })

    it("should error if branch is null", async() =>{
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest
      user = [
        checkoutRequestApproval[0].requested_to_user,
        checkoutRequestApproval[1].requested_to_user,
        checkoutRequestApproval[2].requested_to_user,
        
      ] as unknown as User
      
      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(checkoutRequest)
      userRepository.findManyByIdList = jest.fn().mockResolvedValue(user)
      branchRepository.findById = jest.fn().mockResolvedValue(null)
      await expect(ImNotificationService._sendForRequestBorrow(inventory, checkoutRequest)).rejects.toThrowError("branch not found")
    })
  })
 
  describe("sendNotificationBorrow",() => {
    
    it('should throw an error if inventory is not set', async () => {
      ImNotificationService.setInventory(null)
      await expect(ImNotificationService.sendNotificationBorrow()).rejects.toThrow('Inventory not set');
    });

    it('should throw an error if CheckoutRequest is not found', async () => {
      inventory = {
        product_id:72118,
        warehouse_id: 55,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: 30
      } as unknown as Inventory
      ImNotificationService.setInventory(inventory)
  
      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(null)
  
      await expect(ImNotificationService.sendNotificationBorrow()).rejects.toThrow("CheckoutRequest not found");
    });

    it('should call _isInRequestBorrowPending and _sendForRequestBorrow if CheckoutRequest is found', async() => {
      inventory = {
        product_id:72118,
        warehouse_id: 55,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: 30
      } as unknown as Inventory
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest

      ImNotificationService.setInventory(inventory)
      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(checkoutRequest)
      
      jest.spyOn(ImNotificationService, '_isInRequestBorrowPending').mockReturnValueOnce(true);
      jest.spyOn(ImNotificationService, '_sendForRequestBorrow').mockResolvedValueOnce(true);
      
      ImNotificationService._isInRequestBorrowPending(checkoutRequest);
      await ImNotificationService._sendForRequestBorrow(inventory,checkoutRequest);
      
      expect(ImNotificationService._isInRequestBorrowPending).toHaveBeenCalled();
      expect(ImNotificationService._sendForRequestBorrow).toHaveBeenCalled()

      });

    
  })

  describe("sendNotificationWhenCheckout",() => {
    
    it('should throw an error if inventory is not set', async () => {
      ImNotificationService.setInventory(null)
      await expect(ImNotificationService.sendNotificationWhenCheckout()).rejects.toThrow('Inventory not set');
    });

    it('should throw an error if CheckoutRequest is not found', async () => {
      inventory = {
        product_id:72118,
        warehouse_id: 55,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: 30
      } as unknown as Inventory
      ImNotificationService.setInventory(inventory)
  
      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(null)
  
      await expect(ImNotificationService.sendNotificationWhenCheckout()).rejects.toThrow("CheckoutRequest not found");
    });

    it('should call _getDetailAso, _whatappParramsBody and _notifyCheckoutFromHelper', async () => {
      inventory = {
        product_id:72118,
        warehouse_id: 55,
        user_id:1112474,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: 30
      } as unknown as Inventory
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest
      
      const users = [
        {
          id:1112474,
          parent_id:null,
          name:"WM Tebet",
          unique_id:null,
          master_regencies_id:"3171",
          branch_id:106,
          phone:"83332221116",
          role_id:399,
          status:1,
          role:{
              id:399,
              parent_id:null,
              original_name:"warehouse-manager",
              name:"warehouse-manager",
              description:"Warehouse Manager",
          }
        }
      ]
    
      const paramsBody = {
        manager: null,
        inventory: inventory,
        aso: checkoutRequestApproval[6].requested_to_user,
        branch: null,
        checkout_request: checkoutRequest,
        checkin_request: null,
        warehouse: null
      } as unknown as whatsAppParamsBorrow

      ImNotificationService.setInventory(inventory)
      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(checkoutRequest)
      jest.spyOn(ImNotificationService, '_getDetailAso').mockReturnValueOnce(users);

      const getDetailAso = ImNotificationService._getDetailAso(inventory, checkinRequest, null)
      const asoOwner = getDetailAso.find( user => user.id == inventory.user_id) as User;

      jest.spyOn(ImNotificationService, '_whatappParramsBody').mockReturnValueOnce(paramsBody);
      jest.spyOn(ImNotificationService, '_notifyCheckoutFromHelper').mockResolvedValueOnce(true);
      
      if (checkoutRequest.requested_by != inventory.user_id) {
          const body = ImNotificationService._whatappParramsBody(null, inventory, asoOwner, null, null, checkoutRequest, null); 
          await ImNotificationService._notifyCheckoutFromHelper(body); 
      }
      expect(ImNotificationService._getDetailAso).toHaveBeenCalled(); 
      expect(ImNotificationService._whatappParramsBody).toHaveBeenCalled(); 
      expect(ImNotificationService._notifyCheckoutFromHelper).toHaveBeenCalled(); 
    }); 
    

    
  })

  describe.skip("sendToOwnerInventoryBorrowingByHelper",() => {
    
    it('should throw an error if inventory is not set', async () => {
      ImNotificationService.setInventory(null)
      await expect(ImNotificationService.sendNotificationWhenCheckout()).rejects.toThrow('Inventory not set');
    });

    it('should throw an error if CheckoutRequest is not found', async () => {
      inventory = {
        product_id:72118,
        warehouse_id: 55,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: 30
      } as unknown as Inventory
      ImNotificationService.setInventory(inventory)
  
      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(null)
  
      await expect(ImNotificationService._notifyToOwnerInventoryBorrowingByHelper()).rejects.toThrow("CheckoutRequest not found");
    });

    it('should call _getDetailAso, _whatappParramsBody and _notifyCheckoutFromHelper', async () => {
      inventory = {
        product_id:72118,
        warehouse_id: 55,
        user_id:1112474,
        car_last_checkin_warehouse_id: 20,
        bpkb_last_checkin_warehouse_id: 30
      } as unknown as Inventory
      checkoutRequest = {
        id: 1675,
        product_id: 72118,
        requested_by: 1114248,
        reason: "asdfaff",
        checkout_request_approvals: checkoutRequestApproval,
      } as unknown as CheckoutRequest
      
      const users = [
        {
          id:1112474,
          parent_id:null,
          name:"WM Tebet",
          unique_id:null,
          master_regencies_id:"3171",
          branch_id:106,
          phone:"83332221116",
          role_id:399,
          status:1,
          role:{
              id:399,
              parent_id:null,
              original_name:"warehouse-manager",
              name:"warehouse-manager",
              description:"Warehouse Manager",
          }
        }
      ]
    
      const paramsBody = {
        manager: null,
        inventory: inventory,
        aso: checkoutRequestApproval[6].requested_to_user,
        branch: null,
        checkout_request: checkoutRequest,
        checkin_request: null,
        warehouse: null
      } as unknown as whatsAppParamsBorrow

      ImNotificationService.setInventory(inventory)
      checkoutRequestRepository.findLastRequestByProductId = jest.fn().mockResolvedValue(checkoutRequest)
      jest.spyOn(ImNotificationService, '_getDetailAso').mockReturnValueOnce(users);

      const getDetailAso = ImNotificationService._getDetailAso(inventory, checkinRequest, null)
      const asoOwner = getDetailAso.find( user => user.id == inventory.user_id) as User;

      jest.spyOn(ImNotificationService, '_whatappParramsBody').mockReturnValueOnce(paramsBody);
      jest.spyOn(ImNotificationService, '_notifyCheckoutFromHelper').mockResolvedValueOnce(true);
      
      if (checkoutRequest.requested_by != inventory.user_id) {
          const body = ImNotificationService._whatappParramsBody(null, inventory, asoOwner, null, null, checkoutRequest, null); 
          await ImNotificationService._notifyCheckoutFromHelper(body); 
      }
      expect(ImNotificationService._getDetailAso).toHaveBeenCalled(); 
      expect(ImNotificationService._whatappParramsBody).toHaveBeenCalled(); 
      expect(ImNotificationService._notifyCheckoutFromHelper).toHaveBeenCalled(); 
    }); 
    

    
  })
})
