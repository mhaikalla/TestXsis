import { DescriptiveInventoryHistory } from './../contracts';
import { messageSoldInventoryForMobile } from '../InventoryHistoryService';

describe('InventoryHistoryService', () => {
    describe('MessageSoldInventoryForMobile', () => {
        it("should return message (Mobil dan BPKB tidak perlu dilakukan check out) if Mobil and Bpkb not in warehouse", () => {
            const messageBody = {
                car_status:"TRANSIT",
                bpkb_status:"TRANSIT",
            } as unknown as DescriptiveInventoryHistory
            expect(messageSoldInventoryForMobile(messageBody)).toEqual("Mobil dan BPKB tidak perlu dilakukan check out");
        });
    
        it("should return message (Silahkan check-out Mobil dari warehouse untuk menyelesaikan proses sellout) if Mobil still in warehouse", () => {
            const messageBody = {
                car_status:"INWAREHOUSE",
                bpkb_status:"TRANSIT",
            } as unknown as DescriptiveInventoryHistory
            expect(messageSoldInventoryForMobile(messageBody)).toEqual("Silahkan check-out Mobil dari warehouse untuk menyelesaikan proses sellout");
        });
    
        it("should return message (Silahkan check-out BPKB dari warehouse untuk menyelesaikan proses sellout) if Bpkb still in warehouse", () => {
            const messageBody = {
                car_status:"TRANSIT",
                bpkb_status:"INWAREHOUSE",
            } as unknown as DescriptiveInventoryHistory
            expect(messageSoldInventoryForMobile(messageBody)).toEqual("Silahkan check-out BPKB dari warehouse untuk menyelesaikan proses sellout");
        });
    
        it("should return message (Silahkan check-out Mobil dan BPKB dari warehouse untuk menyelesaikan proses sellout) if Mobil and Bpkb still in warehouse", () => {
            const messageBody = {
                car_status:"INWAREHOUSE",
                bpkb_status:"INWAREHOUSE",
            } as unknown as DescriptiveInventoryHistory
            expect(messageSoldInventoryForMobile(messageBody)).toEqual("Silahkan check-out Mobil dan BPKB dari warehouse untuk menyelesaikan proses sellout");
        });
    })
    
}) 


