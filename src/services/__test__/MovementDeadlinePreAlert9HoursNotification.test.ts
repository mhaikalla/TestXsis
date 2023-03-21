import MovementDeadlinePreAlert9HoursNotification from '../MovementDeadlinePreAlert9HoursNotification';

import { User, WhatsappBody, Inventory, PushBody } from '../../models';
import { IInventoryRepository, IUserRepository, INotification, INotificationHistoryRepository } from '../contracts'
import Constanta from '../../utils/Constanta';
import moment from 'moment';
import { NotificationType } from '../../constants/notification.enum';


let whatsappNotification: INotification
let pushNotification: INotification
let inventoryRepository: IInventoryRepository
let userRepository: IUserRepository
let notificationHistoryRepository: INotificationHistoryRepository
let user: User


beforeEach(() => {

  whatsappNotification = {
    send: jest.fn()
  }

  pushNotification = {
    send: jest.fn()
  }


  inventoryRepository = {
    findAllUnnotifiedMovementDeadlinePreAlert9Hours: jest.fn()
  } as unknown as IInventoryRepository

  user = {
    id: 1,
    name: 'Jamelino Aso',
    phone: '081234567890',
    role_id: Constanta.ASO_ID
  } as unknown as User

  userRepository = {
    findUserById: jest.fn().mockResolvedValue(user)
  } as unknown as IUserRepository

  notificationHistoryRepository = {
    create: jest.fn()
  } as unknown as INotificationHistoryRepository

})


describe("MovementDeadlinePreAlert9HoursNotification", () => {
  describe("should send notifications when car and bpkb are in different warehouse or only car in borrow", () => {
    it("should throw error if inventories user is not found", async () => {
      const inventory = {
        product_id: 77,
        car_last_checkin_warehouse_id: 1,
        bpkb_last_checkin_warehouse_id: 2,
        car_status: "INWAREHOUSE",
        bpkb_status: "INWAREHOUSE",
      }

      userRepository.findUserById = jest.fn().mockResolvedValue(null)

      inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockResolvedValue([inventory])

      const movementDeadlinePreAlert = new MovementDeadlinePreAlert9HoursNotification(
        whatsappNotification, pushNotification, inventoryRepository, userRepository, notificationHistoryRepository)
      expect(movementDeadlinePreAlert.sendNotification()).rejects.toThrowError("User not found")
    })

    describe("whatsapp notification for movement deadline alert pre 9 hour", () => {
      it("should not send  whatsapp notification for 9 hours if inventories are in the same warehouse", async () => {
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "INWAREHOUSE",
          bpkb_status: "INWAREHOUSE",
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockResolvedValue([inventory])

        const movementDeadlinePreAlert = new MovementDeadlinePreAlert9HoursNotification(whatsappNotification, pushNotification, inventoryRepository, userRepository, notificationHistoryRepository)
        await movementDeadlinePreAlert.sendNotification();

        expect(whatsappNotification.send).not.toBeCalledTimes(1)
        expect(whatsappNotification.send).not.toBeCalledTimes(1)
        expect(inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours).toBeCalledTimes(1)
      })

      it("should not send whatsapp if its in pregrace period", async () => {

        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 2,
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          start_grace_period: moment().add(1, 'days'),
        } as unknown as Inventory

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockResolvedValue([inventory])

        await _sendNotification()

        expect(whatsappNotification.send).not.toBeCalledTimes(1)
      })

      it("should send a whatsapp notification if inventory is in different warehouse", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 2,
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          start_grace_period: moment().subtract(1, 'days'),
        } as unknown as Inventory

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockResolvedValue([inventory])

        await _sendNotification()

        const whatsappBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_3",
          broadcast_name: "wanotif_whole_5193_3",
          parameters: [
            { name: "aso_name", value: user.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: movementDeadline.format("DD-MM-YYYY HH:mm:ss") },
          ]
        }

        expect(whatsappNotification.send).toBeCalledTimes(1)
        expect(whatsappNotification.send).toBeCalledWith(user, whatsappBody)
        expect(whatsappNotification.send).toBeCalledTimes(1)
        expect(inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours).toBeCalledTimes(1)

        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'whatsapp',
          status: 'SUCCESS'
        }))
      })

      it("should create a notification history failed if whatsapp got error", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 2,
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          start_grace_period: moment().subtract(1, 'days'),
        } as unknown as Inventory

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockResolvedValue([inventory])
        whatsappNotification.send = jest.fn().mockRejectedValue(new Error("error"))

        await _sendNotification()

        const whatsappBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_3",
          broadcast_name: "wanotif_whole_5193_3",
          parameters: [
            { name: "aso_name", value: user.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: movementDeadline.format("DD-MM-YYYY HH:mm:ss") },
          ]
        }

        expect(whatsappNotification.send).toBeCalledTimes(1)
        expect(whatsappNotification.send).toBeCalledWith(user, whatsappBody)
        expect(whatsappNotification.send).toBeCalledTimes(1)
        expect(inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours).toBeCalledTimes(1)

        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'whatsapp',
          status: 'FAILED'
        }))
      })


      it("should send a whatsapp notification if inventory is in the same warehouse but car in borrow", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "BORROW",
          bpkb_status: "INWAREHOUSE",
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          product_id: 44,
          start_grace_period: moment().subtract(1, 'days'),
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockReturnValue([inventory])

        await _sendNotification()

        const whatsappBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_3",
          broadcast_name: "wanotif_whole_5193_3",
          parameters: [
            { name: "aso_name", value: user.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: movementDeadline.format("DD-MM-YYYY HH:mm:ss") },
          ]
        }

        expect(whatsappNotification.send).toBeCalledTimes(1)
        expect(whatsappNotification.send).toBeCalledWith(user, whatsappBody)
        expect(whatsappNotification.send).toBeCalledTimes(1)
        expect(inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours).toBeCalledTimes(1)
        expect(userRepository.findUserById).toBeCalledTimes(1)

        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'whatsapp',
          status: 'SUCCESS'
        }))
      })
    })



    describe("push notification for movement deadline alert pre 9 hour", () => {
      it("should not send  push notification for 9 hours if inventories are in the same warehouse", async () => {
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "INWAREHOUSE",
          bpkb_status: "INWAREHOUSE",
          start_grace_period: moment().subtract(1, 'days'),
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockResolvedValue([inventory])

        await _sendNotification()

        expect(pushNotification.send).not.toBeCalledTimes(1)
        expect(pushNotification.send).not.toBeCalledTimes(1)
        expect(inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours).toBeCalledTimes(1)

      })

      it("should send a push notification if inventory is in different warehouse", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 2,
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          start_grace_period: moment().subtract(1, 'days'),
        } as unknown as Inventory

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockResolvedValue([inventory])

        await _sendNotification();

        const pushBody: PushBody = {
          title: "Batas pemindahan mobil 9 jam lagi 🚨",
          message: "Segera simpan mobil dan BPKB di warehouse yang sama agar tidak kena pembatasan buyout"
        }

        expect(pushNotification.send).toBeCalledWith(user, pushBody)
        expect(pushNotification.send).toBeCalledTimes(1)
        expect(pushNotification.send).toBeCalledTimes(1)
        expect(inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours).toBeCalledTimes(1)

        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'push',
          status: 'SUCCESS'
        }))
      })

      it("should send a push notification if inventory is in the same warehouse but car in borrow", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "BORROW",
          bpkb_status: "INWAREHOUSE",
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          start_grace_period: moment().subtract(1, 'days'),
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockReturnValue([inventory])

        await _sendNotification();

        const pushBody: PushBody = {
          title: "Batas pemindahan mobil 9 jam lagi 🚨",
          message: "Segera simpan mobil dan BPKB di warehouse yang sama agar tidak kena pembatasan buyout"
        }
        expect(pushNotification.send).toBeCalledTimes(1)
        expect(pushNotification.send).toBeCalledWith(user, pushBody)
        expect(pushNotification.send).toBeCalledTimes(1)
        expect(inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours).toBeCalledTimes(1)
        expect(userRepository.findUserById).toBeCalledTimes(1)
      })

      it("should create a failed notification history if push notification failed", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "BORROW",
          bpkb_status: "INWAREHOUSE",
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          product_id: 189,
          start_grace_period: moment().subtract(1, 'days'),
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockReturnValue([inventory])
        pushNotification.send = jest.fn().mockRejectedValue(new Error("push notification failed"))

        await _sendNotification();

        const pushBody: PushBody = {
          title: "Batas pemindahan mobil 9 jam lagi 🚨",
          message: "Segera simpan mobil dan BPKB di warehouse yang sama agar tidak kena pembatasan buyout"
        }
        expect(pushNotification.send).toBeCalledTimes(1)
        expect(pushNotification.send).toBeCalledWith(user, pushBody)
        expect(pushNotification.send).toBeCalledTimes(1)
        expect(inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours).toBeCalledTimes(1)
        expect(userRepository.findUserById).toBeCalledTimes(1)
        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'push',
          status: 'FAILED'
        }))
      })

    })


  })

  describe("should send notification when both car and bpkb are borrowed", () => {
    describe("should send notification for whatsapp", () => {
      it("should send a whatsapp notification if inventory is in the same warehouse but car and bpkb in borrow", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "BORROW",
          bpkb_status: "BORROW",
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          product_id: 10,
          start_grace_period: moment().subtract(1, 'days'),
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockReturnValue([inventory])

        await _sendNotification()

        const whatsappBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_4",
          broadcast_name: "wanotif_whole_5193_4",
          parameters: [
            { name: "aso_name", value: user.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: movementDeadline.format("DD-MM-YYYY HH:mm:ss") },
          ]
        }

        expect(whatsappNotification.send).toBeCalledTimes(1)
        expect(whatsappNotification.send).toBeCalledWith(user, whatsappBody)
        expect(whatsappNotification.send).toBeCalledTimes(1)

        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'whatsapp',
          status: 'SUCCESS'
        }))
      })

      it("should be able to send notification to push if whatsapp failed", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "BORROW",
          bpkb_status: "BORROW",
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          product_id: 10,
          start_grace_period: moment().subtract(1, 'days'),
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockReturnValue([inventory])
        whatsappNotification.send = jest.fn().mockRejectedValue(new Error("whatsapp error"))

        await _sendNotification()

        const whatsappBody: WhatsappBody = {
          template_name: "wanotif_whole_5193_4",
          broadcast_name: "wanotif_whole_5193_4",
          parameters: [
            { name: "aso_name", value: user.name ?? "" },
            { name: "car_type", value: inventory.product_name ?? "" },
            { name: "license_number", value: inventory.number_plate ?? "" },
            { name: "checkin_deadline", value: movementDeadline.format("DD-MM-YYYY HH:mm:ss") },
          ]
        }

        expect(whatsappNotification.send).toBeCalledTimes(1)
        expect(whatsappNotification.send).toBeCalledWith(user, whatsappBody)

        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'whatsapp',
          status: 'FAILED'
        }))

      })

    })


    describe("should send notification for push notification", () => {
      it("should send a push notification if inventory is in the same warehouse but car and bpkb in borrow", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "BORROW",
          bpkb_status: "BORROW",
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          product_id: 12,
          start_grace_period: moment().subtract(1, 'days'),
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockReturnValue([inventory])

        await _sendNotification()

        const pushBody: PushBody = {
          title: "Batas check-in mobil dan BPKB 9 jam lagi 🚨",
          message: "Segera check-in mobil dan BPKB ke warehouse yang sama agar tidak kena pembatasan buyout"
        }

        expect(pushNotification.send).toBeCalledTimes(1)
        expect(pushNotification.send).toBeCalledWith(user, pushBody)
        expect(pushNotification.send).toBeCalledTimes(1)
        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'push',
          status: 'SUCCESS'
        }))
      })

      it("should be able to create notification history as error if there's something wrong on sending push notification", async () => {
        const movementDeadline = moment('2022-01-15 08:00')
        const inventory = {
          car_last_checkin_warehouse_id: 1,
          bpkb_last_checkin_warehouse_id: 1,
          car_status: "BORROW",
          bpkb_status: "BORROW",
          product_name: "HONDA BRIO IVTEC E",
          number_plate: "L109Qfg",
          movement_deadline: movementDeadline,
          product_id: 12,
          start_grace_period: moment().subtract(1, 'days'),
        }

        inventoryRepository.findAllUnnotifiedMovementDeadlinePreAlert9Hours = jest.fn().mockReturnValue([inventory])
        pushNotification.send = jest.fn().mockRejectedValue(new Error("push error"))

        await _sendNotification()

        const pushBody: PushBody = {
          title: "Batas check-in mobil dan BPKB 9 jam lagi 🚨",
          message: "Segera check-in mobil dan BPKB ke warehouse yang sama agar tidak kena pembatasan buyout"
        }

        expect(pushNotification.send).toBeCalledTimes(1)
        expect(pushNotification.send).toBeCalledWith(user, pushBody)
        expect(pushNotification.send).toBeCalledTimes(1)
        expect(notificationHistoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          recipient_id: user.id,
          product_id: inventory.product_id,
          notification_type: NotificationType.MOVEMENT_DEADLINE_PRE_ALERT_9_HOURS,
          channel: 'push',
          status: 'FAILED'
        }))


      })
    })

  })
})

async function _sendNotification() {
  const movementDeadlinePreAlert = new MovementDeadlinePreAlert9HoursNotification(whatsappNotification, pushNotification, inventoryRepository, userRepository, notificationHistoryRepository)
  await movementDeadlinePreAlert.sendNotification();
}

