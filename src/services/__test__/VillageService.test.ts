import {VillageRepository} from "../../sequelize/VillageRepository";
import {VillageService} from "../VillageService";
import {MasterVillage} from "../../models";

export const villageRepository = new VillageRepository()
export const villageService = new VillageService(villageRepository)

const villages: MasterVillage[] = [
  {
    "id": "1101010001",
    "district_id": "1101010",
    "postal_code": null,
    "name": "LATIUNG",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101010002",
    "district_id": "1101010",
    "postal_code": null,
    "name": "LABUHAN BAJAU",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101020022",
    "district_id": "1101020",
    "postal_code": null,
    "name": "AIR PINANG",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101020023",
    "district_id": "1101020",
    "postal_code": null,
    "name": "KUALA MAKMUR",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101030001",
    "district_id": "1101030",
    "postal_code": null,
    "name": "DIHIT",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101030002",
    "district_id": "1101030",
    "postal_code": null,
    "name": "LAUKE",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101040001",
    "district_id": "1101040",
    "postal_code": null,
    "name": "UJUNG SALANG",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101040002",
    "district_id": "1101040",
    "postal_code": null,
    "name": "PADANG UNOI",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101050007",
    "district_id": "1101050",
    "postal_code": null,
    "name": "SANGGIRAN",
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1101050008",
    "district_id": "1101050",
    "postal_code": null,
    "name": "AMABAAN",
    "created_at": new Date(),
    "updated_at": null
  },
]

describe("Test RegencyService Methods", () => {
  describe("when call getAll() method", () => {
    it('call without params, should return all village data with default limit 10', async () => {
      const findByAllMock = jest.spyOn(villageRepository, 'findAll').mockResolvedValueOnce(villages)
      const response = await villageService.getAll()
      expect(response).toEqual(villages)
      expect(response.length).toBe(10)
      expect(findByAllMock).toHaveBeenCalled()
    });
    it('call with param existing district_id, should return all village data from district_id with default limit 10', async () => {
      const district_id = villages[0].district_id
      const villagesFilter = villages.filter(village => village.district_id === district_id)
      const findByAllMock = jest.spyOn(villageRepository, 'findAll').mockResolvedValueOnce(villagesFilter)
      const response = await villageService.getAll({district_id})
      expect(response).toEqual(villagesFilter)
      expect(response.length).toBeLessThanOrEqual(10)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({district_id})
    });
    it('call with param limit and start_index, should return all village data with the limit', async () => {
      const limit = 5
      const start_index = 2
      const villagesLimit = villages.slice(0, limit)
      const findByAllMock = jest.spyOn(villageRepository, 'findAll').mockResolvedValueOnce(villagesLimit)
      const response = await villageService.getAll({start_index, limit})
      expect(response).toEqual(villagesLimit)
      expect(response.length).toBeLessThanOrEqual(limit)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({start_index, limit})
    });
    it('call with param existing district_id, limit and start_index, should return all village data from district_id with the limit', async () => {
      const limit = 1
      const start_index = 1
      const district_id = villages[0].district_id
      const villagesFilterAndLimit = villages.filter(regency => regency.district_id === district_id).slice(0, limit)
      const findByAllMock = jest.spyOn(villageRepository, 'findAll').mockResolvedValueOnce(villagesFilterAndLimit)
      const response = await villageService.getAll({district_id, start_index, limit})
      expect(response).toEqual(villagesFilterAndLimit)
      expect(response.length).toBeLessThanOrEqual(limit)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({district_id, start_index, limit})
    });
    it('call with param non existing regency_id, limit and start_index, should return throw "There are no village registered', async () => {
      const limit = 1
      const start_index = 1
      const district_id = '999999999'
      const villagesFilterAndLimit: MasterVillage[] = []
      const findByAllMock = jest.spyOn(villageRepository, 'findAll').mockResolvedValueOnce(villagesFilterAndLimit)
      await expect(() => villageService.getAll({district_id, start_index, limit})).rejects.toThrow()
      await expect(() => villageService.getAll({district_id, start_index, limit})).rejects.toThrow("There are no village registered")
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({district_id, start_index, limit})
    });
  });

  describe("when call findById() method", () => {
    it('call with param existing id, should return village data with same id', async () => {
      const id = villages[0].id
      const regency = villages.find(regency => regency.id === id) as MasterVillage
      const findByIdMock = jest.spyOn(villageRepository, 'findById').mockResolvedValueOnce(regency)
      const response = await villageService.findById(id)
      expect(response).toEqual(regency)
      expect(response?.id).toBe(id)
      expect(findByIdMock).toHaveBeenCalled()
      expect(findByIdMock).toHaveBeenCalledWith(id)
    });
    it('call with param non existing id, should return throw "Village not found"', async () => {
      const id = '999999999'
      const district = null
      const findByIdMock = jest.spyOn(villageRepository, 'findById').mockResolvedValueOnce(district)
      await expect(() => villageService.findById(id)).rejects.toThrow()
      await expect(() => villageService.findById(id)).rejects.toThrow("Village not found")
      expect(findByIdMock).toHaveBeenCalled()
      expect(findByIdMock).toHaveBeenCalledWith(id)
    });
  })
})