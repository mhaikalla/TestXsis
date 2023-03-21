import LateCheckinPreAlert9HoursNotification from '../LateCheckinPreAlert9HoursNotification';
import { INotification, IInventoryRepository, IUserRepository, IWarehouseRepository, INotificationHistoryRepository } from '../contracts';
import { User, WhatsappBody, Warehouse, PushBody } from '../../models';
import Constanta from '../../utils/Constanta';
import { NotificationType } from '../../constants/notification.enum';
import moment from 'moment';


let whatsappNotification: INotification;
let pushNotification: INotification;
let inventoryRepository: IInventoryRepository;
let userRepository: IUserRepository;
let warehouseRepository: IWarehouseRepository;
let notificationHistoryRepository: INotificationHistoryRepository
let users: User[];

function getUser(roleId: number): User {
  return users.find(user => user.role_id === roleId) ?? users[0];
}

beforeEach(() => {

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

  whatsappNotification = {
    send: jest.fn(),
  };

  pushNotification = {
    send: jest.fn(),
  };

  inventoryRepository = {
    findAllUnnotifiedLateCheckinPreAlert9Hours: jest.fn(),
  } as unknown as IInventoryRepository;

  warehouseRepository = {
    findById: jest.fn(),
  } as unknown as IWarehouseRepository;

  userRepository = {
    findById: jest.fn().mockResolvedValue(getUser(Constanta.ASO_ID)),
    findHierarchyList: jest.fn().mockResolvedValue(users)
  } as unknown as IUserRepository;

  notificationHistoryRepository = {
    create: jest.fn()
  } as unknown as INotificationHistoryRepository

})

describe("LateCheckinPreAlert9HoursNotification", () => {
  describe("whatsapp notification check", () => {
    it("should not send to whatsapp when car and BPKB are in warehouse", async () => {
      const inventory = {
        car_status: "INWAREHOUSE",
        bpkb_status: "INWAREHOUSE",
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 1,
      }

      inventoryRepository.findAllUnnotifiedLateCheckinPreAlert9Hours = jest.fn().mockResolvedValue([inventory])

      await _sendNotification()

      expect(whatsappNotification.send).not.toBeCalled();
      expect(whatsappNotification.send).not.toBeCalled();
    })

    it("should send to whatsapp when car is in warehouse and BPKB is BORROWED", async () => {

      const carDeadline = moment('2022-01-15 08:00');
      const bpkbDeadline = moment('2022-01-15 06:00');

      const inventory = {
        car_status: "INWAREHOUSE",
        bpkb_status: "BORROW",
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 1,
        user_id: 10,
        warehouse_id: 14,
        product_name: "Honda Jazz",
        number_plate: "B 1234 ABC",
        car_checkin_deadline: carDeadline.toDate(),
        bpkb_checkin_deadline: bpkbDeadline.toDate(),
        product_id: 10
      }

      const warehouse = {
        name: "Warehouse Surabaya",
      } as unknown as Warehouse;

      warehouseRepository.findById = jest.fn().mockResolvedValue(warehouse);

      inventoryRepository.findAllUnnotifiedLateCheckinPreAlert9Hours = jest.fn().mockResolvedValue([inventory])

      userRepository.findById = jest.fn().mockResolvedValue(getUser(Constanta.ASO_ID));

      await _sendNotification()


      expect(whatsappNotification.send).toBeCalled();
      expect(userRepository.findById).toBeCalledWith(inventory.user_id);
      expect(warehouseRepository.findById).toBeCalledWith(inventory.warehouse_id);
      expect(userRepository.findHierarchyList).toBeCalledWith(getUser(Constanta.ASO_ID));

      function whatsappBodyFor(user: User): WhatsappBody {
        return {
          template_name: "wanotif_whole_5193_6",
          broadcast_name: "wanotif_whole_5193_6",
          parameters: [
            { name: "recipient_name", value: user.name ?? "" },
            { name: "items", value: "BPKB" },
            { name: "aso_name", value: getUser(Constanta.ASO_ID).name ?? "" },
            { name: "warehouse_name", value: warehouse.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: bpkbDeadline.format("DD-MM-YYYY HH:mm:ss") },
            { name: "link_aso_phone_number", value: getUser(Constanta.ASO_ID).phone ?? "" },
          ]
        }
      }

      expect(whatsappNotification.send).toHaveBeenNthCalledWith(1, getUser(Constanta.ROLE_SALES_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_SALES_MANAGER_ID)));
      //expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.WAREHOUSE_MANAGER_ID), whatsappBodyFor(getUser(Constanta.WAREHOUSE_MANAGER_ID)));
      //expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID), whatsappBodyFor(getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.ROLE_AREA_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_AREA_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.ROLE_REGIONAL_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_REGIONAL_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(4, getUser(Constanta.ROLE_HEAD_ID), whatsappBodyFor(getUser(Constanta.ROLE_HEAD_ID)));

      function expectNotificationHistoryCreate(user:User) {
        return expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.LATE_CHECKIN_PRE_ALERT_9_HOURS,
          channel: 'whatsapp',
          status: 'SUCCESS'
        })
      }

      expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(1, expectNotificationHistoryCreate(getUser(Constanta.ROLE_SALES_MANAGER_ID)))
      //expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(2, expectNotificationHistoryCreate(getUser(Constanta.WAREHOUSE_MANAGER_ID)))
      //expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(3, expectNotificationHistoryCreate(getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID)))
      expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(2, expectNotificationHistoryCreate(getUser(Constanta.ROLE_AREA_MANAGER_ID)))
      expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(3, expectNotificationHistoryCreate(getUser(Constanta.ROLE_REGIONAL_MANAGER_ID)))
      expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(4, expectNotificationHistoryCreate(getUser(Constanta.ROLE_HEAD_ID)))

      expect(whatsappNotification.send).toBeCalledTimes(4);
    })

    it("should send to whatsapp when car is borrowed and BPKB is in warehouse", async () => {
      const carDeadline = moment('2022-01-15 08:00');
      const bpkbDeadline = moment('2022-01-15 06:00');

      const inventory = {
        car_status: "BORROW",
        bpkb_status: "INWAREHOUSE",
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 1,
        user_id: 10,
        warehouse_id: 14,
        product_name: "Honda Jazz",
        number_plate: "B 1234 ABC",
        car_checkin_deadline: carDeadline.toDate(),
        bpkb_checkin_deadline: bpkbDeadline.toDate(),
      }

      const warehouse = {
        name: "Warehouse Surabaya",
      } as unknown as Warehouse;

      warehouseRepository.findById = jest.fn().mockResolvedValue(warehouse);
      inventoryRepository.findAllUnnotifiedLateCheckinPreAlert9Hours = jest.fn().mockResolvedValue([inventory])
      userRepository.findById = jest.fn().mockResolvedValue(getUser(Constanta.ASO_ID));

      await _sendNotification()

      expect(whatsappNotification.send).toBeCalled();
      expect(userRepository.findById).toBeCalledWith(inventory.user_id);
      expect(warehouseRepository.findById).toBeCalledWith(inventory.warehouse_id);
      expect(userRepository.findHierarchyList).toBeCalledWith(getUser(Constanta.ASO_ID));

      function whatsappBodyFor(user: User): WhatsappBody {
        return {
          template_name: "wanotif_whole_5193_6",
          broadcast_name: "wanotif_whole_5193_6",
          parameters: [
            { name: "recipient_name", value: user.name ?? "" },
            { name: "items", value: "mobil" },
            { name: "aso_name", value: getUser(Constanta.ASO_ID).name ?? "" },
            { name: "warehouse_name", value: warehouse.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: carDeadline.format("DD-MM-YYYY HH:mm:ss") },
            { name: "link_aso_phone_number", value: getUser(Constanta.ASO_ID).phone ?? "" },
          ]
        }
      }

      expect(whatsappNotification.send).toHaveBeenNthCalledWith(1, getUser(Constanta.ROLE_SALES_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_SALES_MANAGER_ID)));
      //expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.WAREHOUSE_MANAGER_ID), whatsappBodyFor(getUser(Constanta.WAREHOUSE_MANAGER_ID)));
      //expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID), whatsappBodyFor(getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.ROLE_AREA_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_AREA_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.ROLE_REGIONAL_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_REGIONAL_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(4, getUser(Constanta.ROLE_HEAD_ID), whatsappBodyFor(getUser(Constanta.ROLE_HEAD_ID)));
      expect(whatsappNotification.send).toBeCalled();
    })


    it("should create a failed notification history if there's something wrong with whatsapp", async () => {
      const carDeadline = moment('2022-01-15 08:00');
      const bpkbDeadline = moment('2022-01-15 06:00');

      const inventory = {
        car_status: "BORROW",
        bpkb_status: "INWAREHOUSE",
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 1,
        user_id: 10,
        warehouse_id: 14,
        product_name: "Honda Jazz",
        number_plate: "B 1234 ABC",
        car_checkin_deadline: carDeadline.toDate(),
        bpkb_checkin_deadline: bpkbDeadline.toDate(),
        product_id: 89
      }

      const warehouse = {
        name: "Warehouse Surabaya",
      } as unknown as Warehouse;

      warehouseRepository.findById = jest.fn().mockResolvedValue(warehouse);
      inventoryRepository.findAllUnnotifiedLateCheckinPreAlert9Hours = jest.fn().mockResolvedValue([inventory])
      whatsappNotification.send = jest.fn().mockRejectedValue(new Error("Something wrong with whatsapp"));
      userRepository.findById = jest.fn().mockResolvedValue(getUser(Constanta.ASO_ID));

      await _sendNotification()

      expect(whatsappNotification.send).toBeCalled();
      expect(userRepository.findById).toBeCalledWith(inventory.user_id);
      expect(warehouseRepository.findById).toBeCalledWith(inventory.warehouse_id);
      expect(userRepository.findHierarchyList).toBeCalledWith(getUser(Constanta.ASO_ID));

      function whatsappBodyFor(user: User): WhatsappBody {
        return {
          template_name: "wanotif_whole_5193_6",
          broadcast_name: "wanotif_whole_5193_6",
          parameters: [
            { name: "recipient_name", value: user.name ?? "" },
            { name: "items", value: "mobil" },
            { name: "aso_name", value: getUser(Constanta.ASO_ID).name ?? "" },
            { name: "warehouse_name", value: warehouse.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: carDeadline.format("DD-MM-YYYY HH:mm:ss") },
            { name: "link_aso_phone_number", value: getUser(Constanta.ASO_ID).phone ?? "" },
          ]
        }
      }

      expect(whatsappNotification.send).toHaveBeenNthCalledWith(1, getUser(Constanta.ROLE_SALES_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_SALES_MANAGER_ID)));
      //expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.WAREHOUSE_MANAGER_ID), whatsappBodyFor(getUser(Constanta.WAREHOUSE_MANAGER_ID)));
      //expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID), whatsappBodyFor(getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.ROLE_AREA_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_AREA_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.ROLE_REGIONAL_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_REGIONAL_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(4, getUser(Constanta.ROLE_HEAD_ID), whatsappBodyFor(getUser(Constanta.ROLE_HEAD_ID)));
      expect(whatsappNotification.send).toBeCalled();


      function expectNotificationHistoryCreate(user:User) {
        return expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.LATE_CHECKIN_PRE_ALERT_9_HOURS,
          channel: 'whatsapp',
          status: 'FAILED'
        })
      }

      expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(1, expectNotificationHistoryCreate(getUser(Constanta.ROLE_SALES_MANAGER_ID)))
      //expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(2, expectNotificationHistoryCreate(getUser(Constanta.WAREHOUSE_MANAGER_ID)))
      //expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(3, expectNotificationHistoryCreate(getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID)))
      expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(2, expectNotificationHistoryCreate(getUser(Constanta.ROLE_AREA_MANAGER_ID)))
      expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(3, expectNotificationHistoryCreate(getUser(Constanta.ROLE_REGIONAL_MANAGER_ID)))
      expect(notificationHistoryRepository.create).toHaveBeenNthCalledWith(4, expectNotificationHistoryCreate(getUser(Constanta.ROLE_HEAD_ID)))
    })


    it("should send to whatsapp when car is borrowed and BPKB is in warehouse", async () => {
      const carDeadline = moment('2022-01-15 08:00');
      const bpkbDeadline = moment('2022-01-15 06:00');

      const inventory = {
        car_status: "BORROW",
        bpkb_status: "BORROW",
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 1,
        user_id: 10,
        warehouse_id: 14,
        product_name: "Honda Jazz",
        number_plate: "B 1234 ABC",
        car_checkin_deadline: carDeadline.toDate(),
        bpkb_checkin_deadline: bpkbDeadline.toDate(),
      }

      const warehouse = {
        name: "Warehouse Surabaya",
      } as unknown as Warehouse;

      warehouseRepository.findById = jest.fn().mockResolvedValue(warehouse);
      inventoryRepository.findAllUnnotifiedLateCheckinPreAlert9Hours = jest.fn().mockResolvedValue([inventory])
      userRepository.findById = jest.fn().mockResolvedValue(getUser(Constanta.ASO_ID));

      await _sendNotification()

      expect(whatsappNotification.send).toBeCalled();
      expect(userRepository.findById).toBeCalledWith(inventory.user_id);
      expect(warehouseRepository.findById).toBeCalledWith(inventory.warehouse_id);
      expect(userRepository.findHierarchyList).toBeCalledWith(getUser(Constanta.ASO_ID));

      function whatsappBodyFor(user: User): WhatsappBody {
        return {
          template_name: "wanotif_whole_5193_6",
          broadcast_name: "wanotif_whole_5193_6",
          parameters: [
            { name: "recipient_name", value: user.name ?? "" },
            { name: "items", value: "mobil dan BPKB" },
            { name: "aso_name", value: getUser(Constanta.ASO_ID).name ?? "" },
            { name: "warehouse_name", value: warehouse.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: bpkbDeadline.format("DD-MM-YYYY HH:mm:ss") },
            { name: "link_aso_phone_number", value: getUser(Constanta.ASO_ID).phone ?? "" },
          ]
        }
      }

      expect(whatsappNotification.send).toHaveBeenNthCalledWith(1, getUser(Constanta.ROLE_SALES_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_SALES_MANAGER_ID)));
      //expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.WAREHOUSE_MANAGER_ID), whatsappBodyFor(getUser(Constanta.WAREHOUSE_MANAGER_ID)));
      //expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID), whatsappBodyFor(getUser(Constanta.WAREHOUSE_AREA_CONTROL_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(2, getUser(Constanta.ROLE_AREA_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_AREA_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(3, getUser(Constanta.ROLE_REGIONAL_MANAGER_ID), whatsappBodyFor(getUser(Constanta.ROLE_REGIONAL_MANAGER_ID)));
      expect(whatsappNotification.send).toHaveBeenNthCalledWith(4, getUser(Constanta.ROLE_HEAD_ID), whatsappBodyFor(getUser(Constanta.ROLE_HEAD_ID)));
      expect(whatsappNotification.send).toBeCalled();
    })

  })

  describe("push notification test", () => {

    it("should not be able to send push notification if both items in warehouse", async () => {

      const inventory = {
        car_status: "INWAREHOUSE",
        bpkb_status: "INWAREHOUSE",
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 1,
      }

      inventoryRepository.findAllUnnotifiedLateCheckinPreAlert9Hours = jest.fn().mockResolvedValue([inventory])

      await _sendNotification()

      expect(pushNotification.send).not.toBeCalled();
    })

    it("should send to push notification when car is borrowed and BPKB is in warehouse", async () => {

      const carDeadline = moment('2022-01-15 08:00');
      const bpkbDeadline = moment('2022-01-15 06:00');

      const inventory = {
        car_status: "INWAREHOUSE",
        bpkb_status: "BORROW",
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 1,
        user_id: 10,
        warehouse_id: 14,
        product_name: "Honda Jazz",
        number_plate: "B 1234 ABC",
        car_checkin_deadline: carDeadline.toDate(),
        bpkb_checkin_deadline: bpkbDeadline.toDate(),
        product_id: 38
      }

      inventoryRepository.findAllUnnotifiedLateCheckinPreAlert9Hours = jest.fn().mockResolvedValue([inventory])
      userRepository.findById = jest.fn().mockResolvedValue(getUser(Constanta.ASO_ID));

      await _sendNotification()

      const pushBody: PushBody = {
        title: "Batas check-in mobil dan BPKB 9 jam lagi 🚨",
        message: "Ingatkan ASO untuk menyimpan mobil dan BPKB di warehouse yang sama agar cabangmu tidak kena pembatasan buyout"
      }

      expect(pushNotification.send).toBeCalled();
      expect(pushNotification.send).toBeCalledWith(getUser(Constanta.ROLE_SALES_MANAGER_ID), pushBody);

      expect(notificationHistoryRepository.create).toBeCalledWith(
        expect.objectContaining({
          recipient_id: getUser(Constanta.ROLE_SALES_MANAGER_ID).id,
          product_id: inventory.product_id,
          notification_type: NotificationType.LATE_CHECKIN_PRE_ALERT_9_HOURS,
          channel: 'push',
          status: 'SUCCESS'
        })
      );
    })


    it("should create failed notification if there's something wrong in push notification", async () => {

      const carDeadline = moment('2022-01-15 08:00');
      const bpkbDeadline = moment('2022-01-15 06:00');

      const inventory = {
        car_status: "INWAREHOUSE",
        bpkb_status: "BORROW",
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 1,
        user_id: 10,
        warehouse_id: 14,
        product_name: "Honda Jazz",
        number_plate: "B 1234 ABC",
        car_checkin_deadline: carDeadline.toDate(),
        bpkb_checkin_deadline: bpkbDeadline.toDate(),
        product_id: 38
      }

      inventoryRepository.findAllUnnotifiedLateCheckinPreAlert9Hours = jest.fn().mockResolvedValue([inventory])
      userRepository.findById = jest.fn().mockResolvedValue(getUser(Constanta.ASO_ID));
      pushNotification.send = jest.fn().mockRejectedValue(new Error("error"));

      await _sendNotification()

      const pushBody: PushBody = {
        title: "Batas check-in mobil dan BPKB 9 jam lagi 🚨",
        message: "Ingatkan ASO untuk menyimpan mobil dan BPKB di warehouse yang sama agar cabangmu tidak kena pembatasan buyout"
      }

      expect(pushNotification.send).toBeCalled();
      expect(pushNotification.send).toBeCalledWith(getUser(Constanta.ROLE_SALES_MANAGER_ID), pushBody);

      expect(notificationHistoryRepository.create).toBeCalledWith(
        expect.objectContaining({
          recipient_id: getUser(Constanta.ROLE_SALES_MANAGER_ID).id,
          product_id: inventory.product_id,
          notification_type: NotificationType.LATE_CHECKIN_PRE_ALERT_9_HOURS,
          channel: 'push',
          status: 'FAILED'
        })
      );

    })

  })
})

async function _sendNotification() {
  const notification = new LateCheckinPreAlert9HoursNotification(
    whatsappNotification,
    pushNotification,
    inventoryRepository,
    userRepository,
    warehouseRepository,
    notificationHistoryRepository
  );
  await notification.sendNotification();
}


