import ConsignmentService from '../ConsignmentService';
import { IConsignmentRepository } from '../contracts'
import { Consignment } from '../../models'
import moment from 'moment'

let consignmentRepository: IConsignmentRepository

let now: Date

beforeEach(() => {

  consignmentRepository = {
    create: jest.fn(),
  } as unknown as IConsignmentRepository

  now = new Date("2022-01-19T01:44:11.985Z")
  jest.spyOn(moment, 'utc').mockImplementation(() => {
    return {
      toDate: jest.fn(() => {
        return now
      })
    } as unknown as moment.Moment
  })
})


describe("ConsignmentService", () => {
  describe("Update payment status", () => {
    it("should update payment status", async () => {
      const productId = 1
      const status = "IN_PROGRESS"
      const consigneeId = 3

      let consignment = {
        product_id: productId,
        status,
        consignee_id: consigneeId,
        consigned_product_id: null,
        handover_date: null,
        is_checkout_finished: false,
      } as unknown as Consignment

      consignmentRepository.create = jest.fn().mockResolvedValueOnce(consignment)

      const consignmentService = new ConsignmentService(consignmentRepository);
      await consignmentService.payProvision(productId, status, consigneeId);

      expect(consignmentRepository.create).toBeCalledWith(consignment)
    });
  })

})
