import MovementDeadlineNotification from '../MovementDeadlineNotification';
import { INotification, IUserRepository } from '../contracts';
import { User, Inventory, WhatsappBody, PushBody } from '../../models'
import moment from 'moment';

let pushNotification: INotification
let waNotification: INotification
let userRepository: IUserRepository
let inventory: Inventory
let user: User

beforeEach(() => {
  pushNotification = {
    send: jest.fn().mockResolvedValue(true)
  }

  waNotification = {
    send: jest.fn().mockResolvedValue(true)
  }

  user = { name: "John Doe" } as unknown as User;

  userRepository = {
    findUserById: jest.fn().mockResolvedValue(user)
  } as unknown as IUserRepository


  inventory = {} as unknown as Inventory;
})

describe("MovementDeadlineNotification", () => {
  describe("send notification defend if inventory or user not exist", () => {
    it("should throw error if user not found", () => {
      const movementDeadlineNotification = new MovementDeadlineNotification(
        waNotification,
        pushNotification,
        userRepository
      );

      userRepository.findUserById = jest.fn().mockResolvedValue(null)

      movementDeadlineNotification.setInventory(inventory);

      expect(movementDeadlineNotification.sendNotification()).rejects.toThrowError("User not found");
    })

    it("should throw error if inventory not set", () => {
      const movementDeadlineNotification = new MovementDeadlineNotification(
        waNotification,
        pushNotification,
        userRepository
      );

      expect(movementDeadlineNotification.sendNotification()).rejects.toThrowError("Inventory not set");
    })
  });

  describe("should remind ASO to move their car and bpkb to any warehouse", () => {
    describe("should check in whatsapp both inventory are in different warehouse or just car is in borrow", () => {
      it("should not send to whatsapp if both inventory is in the same warehouse", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "INWAREHOUSE",
          bpkb_status: "INWAREHOUSE",
          start_grace_period: moment().subtract(1, "days").toDate()
        } as unknown as Inventory;

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        expect(waNotification.send).not.toBeCalled();
      })

      it("should not send if inventory in pregrace period of start_grace_period of null", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_cherkin_warehouse_id: 2,
          car_status: "BORROW",
          bpkb_status: "INWAREHOUSE",
          start_grace_period: null
        } as unknown as Inventory;

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        expect(waNotification.send).not.toBeCalled();
      })

      it("should not send if inventory in pregrace period of start_grace_period is in future", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 2,
          car_status: "BORROW",
          bpkb_status: "INWAREHOUSE",
          start_grace_period: moment().add(1, "days").toDate()
        } as unknown as Inventory;

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        expect(waNotification.send).not.toBeCalled();

      })


      it("should send to whatsapp if both inventory are in different warehouse", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 2,
          product_name: "Honda Jazz",
          number_plate: "B 1234 ABC",
          movement_deadline: new Date(2023, 0, 1, 0, 0, 0, 0),
          start_grace_period: moment().subtract(1, "days").toDate()
        } as unknown as Inventory;

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        const waBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_1",
          broadcast_name: "wanotif_whole_5193_1",
          parameters: [
            { name: "aso_name", value: "John Doe" },
            { name: "car_name", value: inventory.product_name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: inventory.movement_deadline?.toISOString() ?? "" },
          ]
        }

        expect(waNotification.send).toBeCalledWith(user, waBody);
      })

      it("should send to whatsapp if just car is in borrow and bpkb is in warehouse", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          bpkb_status: "INWAREHOUSE",
          car_status: "BORROW",
          start_grace_period: moment().subtract(1, "days").toDate()

        } as unknown as Inventory;

        const waBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_1",
          broadcast_name: "wanotif_whole_5193_1",
          parameters: [
            { name: "aso_name", value: "John Doe" },
            { name: "car_name", value: inventory.product_name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: inventory.movement_deadline?.toISOString() ?? "" },
          ]
        }

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        expect(waNotification.send).toBeCalledWith(user, waBody);
      })
    })

    describe("should check in push notification both inventory are in differnet warehouse or just car is in borrow", () => {
      it("should not send to push notification if both inventory is in the same warehouse", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "INWAREHOUSE",
          bpkb_status: "INWAREHOUSE",
          start_grace_period: moment().subtract(1, "days").toDate()
        } as unknown as Inventory;

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        expect(pushNotification.send).not.toBeCalled();
      })

      it("should send to push notification if both inventory are in different warehouse", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 2,
          car_status: "INWAREHOUSE",
          bpkb_status: "INWAREHOUSE",
          start_grace_period: moment().subtract(1, "days").toDate()
        } as unknown as Inventory;

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        const pushBody: PushBody = {
          title: "Segera bawa mobilmu ke warehouse BPKB ⌛️",
          message: "Masa Eksklusif ASO-mu berakhir, mobil dan BPKB harus berada di warehouse yang sama"
        }

        expect(pushNotification.send).toBeCalledWith(user, pushBody);
      })

      it("should send to push notification if just car is in borrow and bpkb is in warehouse", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          bpkb_status: "INWAREHOUSE",
          car_status: "BORROW",
          start_grace_period: moment().subtract(1, "days").toDate()

        } as unknown as Inventory;

        const pushBody: PushBody = {
          title: "Segera bawa mobilmu ke warehouse BPKB ⌛️",
          message: "Masa Eksklusif ASO-mu berakhir, mobil dan BPKB harus berada di warehouse yang sama"
        }

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        expect(pushNotification.send).toBeCalledWith(user, pushBody);
      })
    })
  });


  describe("should remind ASO if both inventory are in borrow", () => {
    describe("should send to whatsapp if both inventory are in borrow", () => {
      it("should send to whatsapp if both inventory are in borrow", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          bpkb_status: "BORROW",
          car_status: "BORROW",
          start_grace_period: moment().subtract(1, "days").toDate()

        } as unknown as Inventory;

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();
        const waBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_2",
          broadcast_name: "wanotif_whole_5193_2",
          parameters: [
            { name: "aso_name", value: user.name ?? "" },
            { name: "car_name", value: inventory.product_name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: inventory.movement_deadline?.toISOString() ?? "" },
          ]
        }
        expect(waNotification.send).toBeCalledWith(user, waBody);

      })
    })

    describe("should send to push notification if both inventory are in borrow", () => {
      it("should send to push notification if both inventory are in borrow", async () => {
        const movementDeadlineNotification = new MovementDeadlineNotification(
          waNotification,
          pushNotification,
          userRepository
        );

        inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          bpkb_status: "BORROW",
          car_status: "BORROW",
          start_grace_period: moment().subtract(1, "days").toDate()

        } as unknown as Inventory;

        movementDeadlineNotification.setInventory(inventory);

        await movementDeadlineNotification.sendNotification();

        const pushBody: PushBody = {
          title: "Segera check-in mobil dan BPKB ke warehouse ⌛️",
          message: "Masa Eksklusif ASO-mu berakhir, segera check-in mobil dan BPKB ke warehouse yang sama"
        }

        expect(pushNotification.send).toBeCalledWith(user, pushBody);
      })
    })

  })
})

