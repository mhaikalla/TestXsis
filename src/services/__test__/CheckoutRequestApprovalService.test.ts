import {CheckoutRequestApprovalRepository} from "../../sequelize/CheckoutRequestApprovalRepository";
import {CheckoutRequestApprovalService} from "../CheckoutRequestApprovalService";

export const checkoutRequestApprovalRepository = new CheckoutRequestApprovalRepository()
export const checkoutRequestApprovalService = new CheckoutRequestApprovalService(checkoutRequestApprovalRepository)

describe("Test CheckoutRequestApprovalService Methods", () => {
  describe('some test', () => {
    it('should a test', function () {

    });
  });
})