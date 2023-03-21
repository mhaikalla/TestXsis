import {ProductMovementRepository} from "../../sequelize/ProductMovementRepository";
import {ProductMovementService} from "../ProductMovementService";

export const productMovementRepository = new ProductMovementRepository()
export const productMovementService = new ProductMovementService(productMovementRepository)

describe("Test ProductMovementService Methods", () => {
  describe('some test', () => {
    it('should a test', function () {

    });
  });
})