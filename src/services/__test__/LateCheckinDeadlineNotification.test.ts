import LateCheckinDeadlineNotification from '../LateCheckinDeadlineNotification';
import { User, Inventory, WhatsappBody, PushBody, Branch, Warehouse } from '../../models'
import { INotification, IUserRepository, IBranchRepository, IWarehouseRepository } from '../contracts';
import Constanta from '../../utils/Constanta';
import moment from 'moment';

let whatsappNotification: INotification
let pushNotification: INotification
let userRepository: IUserRepository
let branchRepository: IBranchRepository
let warehouseRepository: IWarehouseRepository
let inventory: Inventory;
let user: User;
let users: User[];
let branch: Branch;

function getUser(roleId: number): User {
  return users.find(user => user.role_id === roleId) ?? user
}


beforeEach(() => {
  pushNotification = {
    send: jest.fn().mockResolvedValue(true),
  };
  whatsappNotification = {
    send: jest.fn().mockResolvedValue(true),
  };

  users = [
    {
      id: 1,
      name: "John Doe ASO",
      role_id: Constanta.ASO_ID,
      phone: "081234567890",
    } as unknown as User,
    {
      id: 2,
      name: "Jennifer Doe SM",
      role_id: Constanta.ROLE_SALES_MANAGER_ID,
      phone: "081122334455",
    } as unknown as User,
    {
      id: 3,
      name: "Jane Doe ASO",
      role_id: Constanta.ASO_ID
    } as unknown as User,
    {
      id: 4,
      name: "Jenny Doe ASO",
      role_id: Constanta.ASO_ID
    } as unknown as User,
    {
      id: 5,
      name: "Jamelino WM",
      role_id: Constanta.WAREHOUSE_MANAGER_ID
    } as unknown as User,
    {
      id: 6,
      name: "Hamala WACM",
      role_id: Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID
    } as unknown as User,
    {
      id: 7,
      name: "Jasmine AM",
      role_id: Constanta.ROLE_AREA_MANAGER_ID
    } as unknown as User,
    {
      id: 8,
      name: "Rizka RM",
      role_id: Constanta.ROLE_REGIONAL_MANAGER_ID
    } as unknown as User,
    {
      id: 9,
      name: "Gunter HEAD",
      role_id: Constanta.ROLE_HEAD_ID
    } as unknown as User,
  ];

  user = users[0]

  userRepository = {
    findUserById: jest.fn().mockResolvedValue(user),
    findAsoByBranchId: jest.fn().mockResolvedValue([user]),
    findHierarchyList: jest.fn().mockResolvedValue([user])
  } as unknown as IUserRepository;

  branch = { id: 1, name: "Branch Surabaya" } as unknown as Branch
  branchRepository = {
    findById: jest.fn().mockResolvedValue(branch)
  } as unknown as IBranchRepository;
  inventory = {} as unknown as Inventory;

  warehouseRepository = {
    findById: jest.fn().mockResolvedValue({ id: 1, name: "Warehouse Surabaya" } as unknown as Warehouse)
  } as unknown as IWarehouseRepository
});

describe("LateCheckinDeadlineNotification", () => {
  describe("should guard send notification", () => {
    it("should throw error if inventory is not set", async () => {
      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);
      await expect(movementDeadlineNotification.sendNotification()).rejects.toThrowError("Inventory is not set");
    })
    it("should throw error if user is not found", async () => {
      userRepository.findUserById = jest.fn().mockResolvedValue(null);

      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);
      movementDeadlineNotification.setInventory(inventory);
      await expect(movementDeadlineNotification.sendNotification()).rejects.toThrowError("User is not found");
    })
  });

  describe("send notification to whatsapp for all borrow condition", () => {
    it("should not send notification to whatsapp if car and bpkb is in warehouse", async () => {
      inventory = {
        car_status: "INWAREHOUSE",
        bpkb_status: "INWAREHOUSE",
      } as unknown as Inventory;

      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);

      movementDeadlineNotification.setInventory(inventory);

      await movementDeadlineNotification.sendNotification();
      expect(whatsappNotification.send).not.toBeCalled();
    })

    it("should send notification to whatsapp car borrowed", async () => {
      const bpkbDeadline = moment('2022-01-10 08:00');
      const carDeadline = moment('2022-01-15 08:00');

      inventory = {
        car_status: "BORROW",
        bpkb_status: "INWAREHOUSE",
        bpkb_checkin_deadline: bpkbDeadline,
        car_checkin_deadline: carDeadline,
      } as unknown as Inventory;

      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);

      user.name = "John Doe";
      movementDeadlineNotification.setInventory(inventory);

      const whatsappBody: WhatsappBody = {
        template_name: "wanotif_whole_5193_5",
        broadcast_name: "wanotif_whole_5193_5",
        parameters: [
          { name: "aso_name", value: user.name ?? "" },
          { name: "car_type", value: inventory.product_name ?? "" },
          { name: "license_number", value: inventory.number_plate ?? "" },
          { name: "checkin_deadline", value: carDeadline.format("DD-MM-YYYY HH:mm:ss") },
        ]
      }
      await movementDeadlineNotification.sendNotification();
      expect(whatsappNotification.send).toBeCalledWith(user, whatsappBody);
      expect(whatsappNotification.send).toBeCalledTimes(1);
    })

    it("should send notification to whatsapp both bpkp and car borrowed", async () => {
      inventory = {
        car_status: "BORROW",
        bpkb_status: "BORROW",
      } as unknown as Inventory;

      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);

      movementDeadlineNotification.setInventory(inventory);

      await movementDeadlineNotification.sendNotification();
      expect(whatsappNotification.send).toBeCalled();
      expect(whatsappNotification.send).toBeCalled();
    })

    it("should send notification to whatsapp and push notification if in different warehouse", async () => {

      inventory = {
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 2,
        car_status: "INWAREHOUSE",
        bpkb_status: "INWAREHOUSE",
      } as unknown as Inventory;

      const lateCheckinDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);

      lateCheckinDeadlineNotification.setInventory(inventory);

      await lateCheckinDeadlineNotification.sendNotification();
      expect(whatsappNotification.send).toBeCalled();
      expect(whatsappNotification.send).toBeCalled();
    })
  })

  describe("send notification to push notification for all borrow condition", () => {
    it("should not send notification to push notification if car and bpkb is in warehouse", async () => {
      inventory = {
        car_status: "INWAREHOUSE",
        bpkb_status: "INWAREHOUSE",
      } as unknown as Inventory;

      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);

      movementDeadlineNotification.setInventory(inventory);

      await movementDeadlineNotification.sendNotification();
      expect(pushNotification.send).not.toBeCalled();
      expect(pushNotification.send).not.toBeCalled();
    })

    it("should send notification to push notification car borrowed", async () => {
      inventory = {
        car_status: "BORROW",
        bpkb_status: "INWAREHOUSE",
      } as unknown as Inventory;

      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);

      user.name = "John Doe";
      movementDeadlineNotification.setInventory(inventory);

      await movementDeadlineNotification.sendNotification();
      const pushBody: PushBody = {
        title: "Fitur buyout kamu dinonaktifkan 🚨",
        message: "Segera simpan mobil dan BPKB di warehouse yang sama agar bisa buyout lagi"
      }

      expect(pushNotification.send).toBeCalledWith(user, pushBody)
      expect(pushNotification.send).toBeCalled();

    })


    it("should send notification to whatsapp both bpkp and car borrowed", async () => {
      inventory = {
        car_status: "BORROW",
        bpkb_status: "BORROW",
      } as unknown as Inventory;

      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);

      movementDeadlineNotification.setInventory(inventory);

      await movementDeadlineNotification.sendNotification();
      expect(pushNotification.send).toBeCalled();
      expect(pushNotification.send).toBeCalled();
    })
  })

  describe("send push notification to other aso for all borrow condition", () => {
    it("should send notification to push notification for other aso if car and bpkb is in warehouse", async () => {
      inventory = {
        user_id: 1,
        branch_id: 1,
        car_status: "BORROW",
        bpkb_status: "INWAREHOUSE",
      } as unknown as Inventory;

      user = {
        id: 1,
        role_id: Constanta.ASO_ID,
        name: "John Doe"
      } as unknown as User;

      userRepository.findUserById = jest.fn().mockResolvedValue(user);

      userRepository.findAsoByBranchId = jest.fn().mockResolvedValue(users);

      const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);

      movementDeadlineNotification.setInventory(inventory);

      await movementDeadlineNotification.sendNotification();

      const asoPushBody: PushBody = {
        title: "Fitur buyout kamu dinonaktifkan 🚨",
        message: "Segera simpan mobil dan BPKB di warehouse yang sama agar bisa buyout lagi"
      }
      const otherAsoPushBody: PushBody = {
        title: "Fitur buyout kamu dinonaktifkan 🚨",
        message: "Ada ASO di cabang kamu yang terlambat check-in. Hubungi SM untuk info lebih lanjut"
      }

      expect(pushNotification.send).toHaveBeenCalledWith(user, asoPushBody);
      expect(pushNotification.send).toHaveBeenCalledWith(users[2], otherAsoPushBody);
      expect(pushNotification.send).toHaveBeenCalledWith(users[3], otherAsoPushBody);
    })
  })

  describe("should notify branches for freeze punishment", () => {
    describe("should notify on whatsapp for freeze punishment", () => {
      it("should notify whatsapp for superior in branch for freeze punishment car still in borrow", async () => {
        const bpkbDeadline = moment('2022-01-18 08:00');
        const carDeadline = moment('2022-01-15 08:00');

        inventory = {
          user_id: 1,
          branch_id: 1,
          car_status: "BORROW",
          bpkb_status: "INWAREHOUSE",
          car_checkin_deadline: carDeadline,
          bpkb_checkin_deadline: bpkbDeadline,
        } as unknown as Inventory;

        userRepository.findHierarchyList = jest.fn().mockResolvedValue(users);

        const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);
        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        const whatsappBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_7",
          broadcast_name: "wanotif_whole_5193_7",
          parameters: [
            { name: "recipient_name", value: "" },
            { name: "aso_name", value: user.name ?? "" },
            { name: "items", value: "mobil" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: carDeadline.format("DD-MM-YYYY HH:mm:ss") },
            { name: "link_aso_phone_number", value: user.phone }
          ]
        }

        expect(whatsappNotification.send).toHaveBeenNthCalledWith(1, users[0], expect.anything());

        whatsappBody.parameters[0].value = users[1].name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.ROLE_SALES_MANAGER_ID), whatsappBody);
        whatsappBody.parameters[0].value = users[4].name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.WAREHOUSE_MANAGER_ID), whatsappBody);
        whatsappBody.parameters[0].value = users[5].name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(4, getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID), whatsappBody);
      })


      it("should notify whatsapp for superior in branch for freeze punishment BPKB and car still in borrow", async () => {

        const bpkbDeadline = moment('2022-01-18 08:00');
        const carDeadline = moment('2022-01-15 08:00');
        inventory = {
          user_id: 1,
          branch_id: 1,
          car_status: "BORROW",
          bpkb_status: "BORROW",
          car_checkin_deadline: carDeadline,
          bpkb_checkin_deadline: bpkbDeadline,
        } as unknown as Inventory;

        userRepository.findHierarchyList = jest.fn().mockResolvedValue(users);

        const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);
        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        const whatsappBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_7",
          broadcast_name: "wanotif_whole_5193_7",
          parameters: [
            { name: "recipient_name", value: "" },
            { name: "aso_name", value: user.name ?? "" },
            { name: "items", value: "mobil dan BPKB" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: carDeadline.format("DD-MM-YYYY HH:mm:ss") },
            { name: "link_aso_phone_number", value: user.phone }
          ]
        }

        expect(whatsappNotification.send).toHaveBeenNthCalledWith(1, users[0], expect.anything());
        whatsappBody.parameters[0].value = users[1].name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.ROLE_SALES_MANAGER_ID), whatsappBody);
        whatsappBody.parameters[0].value = users[4].name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.WAREHOUSE_MANAGER_ID), whatsappBody);
        whatsappBody.parameters[0].value = users[5].name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(4, getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID), whatsappBody);
      })
    })

    describe("should send push notification to Sales Manager", () => {
      it("should notify push for Sales Manager in branch for freeze punishment car still in warehouse", async () => {
        inventory = {
          user_id: 1,
          branch_id: 1,
          car_status: "BORROW",
          bpkb_status: "BORROW"
        } as unknown as Inventory;

        userRepository.findHierarchyList = jest.fn().mockResolvedValue(users);

        const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);
        movementDeadlineNotification.setInventory(inventory);
        await movementDeadlineNotification.sendNotification();

        const pushBody: PushBody = {
          title: "Cabangmu kena pembatasan buyout 🚨",
          message: "Ada ASO di cabangmu yang terlambat check-in. Ingatkan agar segera menyimpan mobil dan BPKB di warehouse yang sama"
        }

        expect(pushNotification.send).toHaveBeenNthCalledWith(1, users[0], expect.anything());
        expect(pushNotification.send).toHaveBeenNthCalledWith(2, users[1], pushBody);
      })
    })
  })

  describe("should notify for freeze punishment to upper management", () => {
    describe("should notify on whatsapp to upper management", () => {
      it("should notify whatsapp for freeze punishment car still in warehouse", async () => {
        const bpkbDeadline = moment('2022-01-18 08:00');
        const carDeadline = moment('2022-01-15 08:00');
        inventory = {
          user_id: 1,
          branch_id: 1,
          car_status: "BORROW",
          bpkb_status: "INWAREHOUSE",
          car_checkin_deadline: carDeadline,
          bpkb_checkin_deadline: bpkbDeadline,
        } as unknown as Inventory;

        userRepository.findHierarchyList = jest.fn().mockResolvedValue(users);

        const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);
        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        const whatsappBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_8",
          broadcast_name: "wanotif_whole_5193_8",
          parameters: [
            { name: "recipient_name", value: "" },
            { name: "branch_name", value: "Branch Surabaya" },
            { name: "aso_name", value: user.name ?? "" },
            { name: "items", value: "mobil" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: carDeadline.format("DD-MM-YYYY HH:mm:ss") },
            { name: "link_sm_phone_number", value: "081122334455" }
          ]
        }

        const am = getUser(Constanta.ROLE_AREA_MANAGER_ID);
        const rm = getUser(Constanta.ROLE_REGIONAL_MANAGER_ID);
        const head = getUser(Constanta.ROLE_HEAD_ID);

        whatsappBody.parameters[0].value = am.name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(5, am, whatsappBody);
        whatsappBody.parameters[0].value = rm.name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(6, rm, whatsappBody);
        whatsappBody.parameters[0].value = head.name ?? "";
        expect(whatsappNotification.send).toHaveBeenNthCalledWith(7, head, whatsappBody);

        expect(whatsappNotification.send).toHaveBeenCalledTimes(7);
      })
    })

    describe("should notify on push notification  to upper management", () => {
      it("should notify whatsapp for freeze punishment car still in warehouse", async () => {
        inventory = {
          user_id: 1,
          branch_id: 1,
          car_status: "BORROW",
          bpkb_status: "INWAREHOUSE"
        } as unknown as Inventory;

        userRepository.findHierarchyList = jest.fn().mockResolvedValue(users);

        const movementDeadlineNotification = new LateCheckinDeadlineNotification(whatsappNotification, pushNotification, userRepository, branchRepository, warehouseRepository);
        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        const pushBody: PushBody = {
          title: `${branch.name} kena pembatasan buyout 🚨`,
          message: "Ada ASO di cabang ini yang terlambat check-in. Ingatkan agar segera check-in mobil dan BPKB di warehouse yang sama"
        }

        const am = getUser(Constanta.ROLE_AREA_MANAGER_ID);
        const rm = getUser(Constanta.ROLE_REGIONAL_MANAGER_ID);
        const head = getUser(Constanta.ROLE_HEAD_ID);

        expect(pushNotification.send).toHaveBeenNthCalledWith(3, am, pushBody);
        expect(pushNotification.send).toHaveBeenNthCalledWith(4, rm, pushBody);
        expect(pushNotification.send).toHaveBeenNthCalledWith(5, head, pushBody);
        expect(pushNotification.send).toHaveBeenCalledTimes(5);
      })
    })

  })
})
