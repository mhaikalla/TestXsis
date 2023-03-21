import { DistrictRepository } from "../../sequelize/DistrictRepository";
import { DistrictService } from "../DistrictService";
import { MasterDistrict } from "../../models";

export const districtRepository = new DistrictRepository()
export const districtService = new DistrictService(districtRepository)

const districts: MasterDistrict[] = [
  {
    "id": "1101010",
    "regency_id": "1101",
    "name": "TEUPAH SELATAN",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101020",
    "regency_id": "1101",
    "name": "SIMEULUE TIMUR",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1102010",
    "regency_id": "1102",
    "name": "PULAU BANYAK",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1102011",
    "regency_id": "1102",
    "name": "PULAU BANYAK BARAT",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1103010",
    "regency_id": "1103",
    "name": "TRUMON",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1103011",
    "regency_id": "1103",
    "name": "TRUMON TIMUR",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1104011",
    "regency_id": "1104",
    "name": "BABUL RAHMAH",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1104012",
    "regency_id": "1104",
    "name": "TANOH ALAS",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1105080",
    "regency_id": "1105",
    "name": "SERBA JADI",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1105081",
    "regency_id": "1105",
    "name": "SIMPANG JERNIH",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
]

describe("Test DistrictService Methods", () => {
  describe("when call getAll() method", () => {
    it('call without params, should return all district data with default limit 10', async () => {
      const findByAllMock = jest.spyOn(districtRepository, 'findAll').mockResolvedValueOnce(districts)
      const response = await districtService.getAll()
      expect(response).toEqual(districts)
      expect(response.length).toBe(10)
      expect(findByAllMock).toHaveBeenCalled()
    });
    it('call with param existing regency_id, should return all district data from regency_id with default limit 10', async () => {
      const regencyId = districts[0].regency_id
      const districtsFilter = districts.filter(district => district.regency_id === regencyId)
      const findByAllMock = jest.spyOn(districtRepository, 'findAll').mockResolvedValueOnce(districtsFilter)
      const response = await districtService.getAll({regency_id: regencyId})
      expect(response).toEqual(districtsFilter)
      expect(response.length).toBeLessThanOrEqual(10)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({regency_id: regencyId})
    });
    it('call with param limit and start_index, should return all district data with the limit', async () => {
      const limit = 5
      const start_index = 2
      const districtsLimit = districts.slice(0, limit)
      const findByAllMock = jest.spyOn(districtRepository, 'findAll').mockResolvedValueOnce(districtsLimit)
      const response = await districtService.getAll({start_index, limit})
      expect(response).toEqual(districtsLimit)
      expect(response.length).toBeLessThanOrEqual(limit)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({start_index, limit})
    });
    it('call with param existing regency_id, limit and start_index, should return all district data from regency_id with the limit', async () => {
      const limit = 1
      const start_index = 1
      const regency_id = districts[0].regency_id
      const districtsFilterAndLimit = districts.filter(district => district.regency_id === regency_id).slice(0, limit)
      const findByAllMock = jest.spyOn(districtRepository, 'findAll').mockResolvedValueOnce(districtsFilterAndLimit)
      const response = await districtService.getAll({regency_id, start_index, limit})
      expect(response).toEqual(districtsFilterAndLimit)
      expect(response.length).toBeLessThanOrEqual(limit)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({regency_id, start_index, limit})
    });
    it('call with param non existing regency_id, limit and start_index, should return throw "There are no district registered', async () => {
      const limit = 1
      const start_index = 1
      const regency_id = '999999999'
      const districtsFilterAndLimit: MasterDistrict[] = []
      const findByAllMock = jest.spyOn(districtRepository, 'findAll').mockResolvedValueOnce(districtsFilterAndLimit)
      await expect(() => districtService.getAll({regency_id, start_index, limit})).rejects.toThrow()
      await expect(() => districtService.getAll({regency_id, start_index, limit})).rejects.toThrow("There are no district registered")
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({regency_id, start_index, limit})
    });
  });

  describe("when call findById() method", () => {
    it('call with param existing id, should return district data with same id', async () => {
      const id = districts[0].id
      const district = districts.find(district => district.id === id) as MasterDistrict
      const findByIdMock = jest.spyOn(districtRepository, 'findById').mockResolvedValueOnce(district)
      const response = await districtService.findById(id)
      expect(response).toEqual(district)
      expect(response?.id).toBe(id)
      expect(findByIdMock).toHaveBeenCalled()
      expect(findByIdMock).toHaveBeenCalledWith(id)
    });
    it('call with param non existing id, should return throw "District not found"', async () => {
      const id = '999999999'
      const district = null
      const findByIdMock = jest.spyOn(districtRepository, 'findById').mockResolvedValueOnce(district)
      await expect(() => districtService.findById(id)).rejects.toThrow()
      await expect(() => districtService.findById(id)).rejects.toThrow("District not found")
      expect(findByIdMock).toHaveBeenCalled()
      expect(findByIdMock).toHaveBeenCalledWith(id)
    });
  })
})