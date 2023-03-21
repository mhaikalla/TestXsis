import PreAlertNotificationService from '../PreAlertNotificationService';
import { IPreAlertNotification } from '../contracts';

let movementDeadlinePreAlert9HoursNotification: IPreAlertNotification;
let someOtherPreAlertNotification: IPreAlertNotification;


beforeEach(() => {

  movementDeadlinePreAlert9HoursNotification = {
    sendNotification: jest.fn(),
  }

  someOtherPreAlertNotification = {
    sendNotification: jest.fn(),
  }

})

describe('should be able to test  pre alert notification', () => {
  it('should be able to send notification to first pre alert notification', async () => {
    const notificationService = new PreAlertNotificationService(
      movementDeadlinePreAlert9HoursNotification
    )
    await notificationService.execute()
    expect(movementDeadlinePreAlert9HoursNotification.sendNotification).toHaveBeenCalled()
  });

  it('should be able to send notification to multiple pre alert notifications', async () => {
    const notificationService = new PreAlertNotificationService(
      movementDeadlinePreAlert9HoursNotification,
      someOtherPreAlertNotification
    )
    await notificationService.execute()
    expect(movementDeadlinePreAlert9HoursNotification.sendNotification).toHaveBeenCalled()
    expect(someOtherPreAlertNotification.sendNotification).toHaveBeenCalled()
  });

})
