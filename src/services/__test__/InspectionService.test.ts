import {InspectionService} from "../InspectionService";
import {InspectionResultRepository} from "../../sequelize/InspectionResultRepository";
import {productMovementService} from "./ProductMovementService.test";
import {inventoryRepository, inventoryService} from "./InventoryService.test";
import {userRepository, userService} from "./UserService.test";
import { warehouseRepository } from "./WarehouseService.test";

export const inspectionResultRepository = new InspectionResultRepository()
export const inspectionService = new InspectionService(
    inspectionResultRepository, 
    productMovementService, 
    inventoryService, 
    userService,
    inventoryRepository,
    warehouseRepository,
    userRepository
)