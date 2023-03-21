
import { BlockBuyoutReportService } from "../../services/BlockBuyoutReportService";
import {blockBuyoutRepository} from "./BlockBuyoutReportService.test";
import {inventoryRepository, inventoryService} from "./InventoryService.test";
import { userRepository } from './UserService.test';
import { warehouseRepository, warehouseService } from './WarehouseService.test';

const blockBuyoutReportService = new BlockBuyoutReportService(
    blockBuyoutRepository, 
    inventoryRepository, 
    userRepository, 
    warehouseRepository)

describe('Test CheckoutRequestService Methods', () => {
  describe('some test', () => {
    it('should a test', function () {});
  });
});
