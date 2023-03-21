import { RegencyRepository } from "../../sequelize/RegencyRepository";
import { RegencyService } from "../RegencyService";
import { MasterRegency } from "../../models";

export const regencyRepository = new RegencyRepository()
export const regencyService = new RegencyService(regencyRepository)

export const regencies: MasterRegency[] = [
  {
    "id": "1101",
    "province_id": "11",
    "name": "KABUPATEN SIMEULUE",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1102",
    "province_id": "11",
    "name": "KABUPATEN ACEH SINGKIL",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1201",
    "province_id": "12",
    "name": "KABUPATEN NIAS",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1202",
    "province_id": "12",
    "name": "KABUPATEN MANDAILING NATAL",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1301",
    "province_id": "13",
    "name": "KABUPATEN KEPULAUAN MENTAWAI",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1302",
    "province_id": "13",
    "name": "KABUPATEN PESISIR SELATAN",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1401",
    "province_id": "14",
    "name": "KABUPATEN KUANTAN SINGINGI",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1402",
    "province_id": "14",
    "name": "KABUPATEN INDRAGIRI HULU",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1501",
    "province_id": "15",
    "name": "KABUPATEN KERINCI",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
  {
    "id": "1502",
    "province_id": "15",
    "name": "KABUPATEN MERANGIN",
    "latitude": null,
    "longitude": null,
    "created_at": new Date(),
    "updated_at": null
  },
]

describe("Test RegencyService Methods", () => {
  describe("when call getAll() method", () => {
    it('call without params, should return all regency data with default limit 10', async () => {
      const findByAllMock = jest.spyOn(regencyRepository, 'findAll').mockResolvedValueOnce(regencies)
      const response = await regencyService.getAll()
      expect(response).toEqual(regencies)
      expect(response.length).toBe(10)
      expect(findByAllMock).toHaveBeenCalled()
    });
    it('call with param existing province_id, should return all regency data from regency_id with default limit 10', async () => {
      const province_id = regencies[0].province_id
      const regenciesFilter = regencies.filter(regency => regency.province_id === province_id)
      const findByAllMock = jest.spyOn(regencyRepository, 'findAll').mockResolvedValueOnce(regenciesFilter)
      const response = await regencyService.getAll({province_id})
      expect(response).toEqual(regenciesFilter)
      expect(response.length).toBeLessThanOrEqual(10)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({province_id})
    });
    it('call with param limit and start_index, should return all regency data with the limit', async () => {
      const limit = 5
      const start_index = 2
      const regenciesLimit = regencies.slice(0, limit)
      const findByAllMock = jest.spyOn(regencyRepository, 'findAll').mockResolvedValueOnce(regenciesLimit)
      const response = await regencyService.getAll({start_index, limit})
      expect(response).toEqual(regenciesLimit)
      expect(response.length).toBeLessThanOrEqual(limit)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({start_index, limit})
    });
    it('call with param existing province_id, limit and start_index, should return all regency data from province_id with the limit', async () => {
      const limit = 1
      const start_index = 1
      const province_id = regencies[0].province_id
      const regenciesFilterAndLimit = regencies.filter(regency => regency.province_id === province_id).slice(0, limit)
      const findByAllMock = jest.spyOn(regencyRepository, 'findAll').mockResolvedValueOnce(regenciesFilterAndLimit)
      const response = await regencyService.getAll({province_id, start_index, limit})
      expect(response).toEqual(regenciesFilterAndLimit)
      expect(response.length).toBeLessThanOrEqual(limit)
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({province_id, start_index, limit})
    });
    it('call with param non existing regency_id, limit and start_index, should return throw "There are no regency registered', async () => {
      const limit = 1
      const start_index = 1
      const province_id = '999999999'
      const regenciesFilterAndLimit: MasterRegency[] = []
      const findByAllMock = jest.spyOn(regencyRepository, 'findAll').mockResolvedValueOnce(regenciesFilterAndLimit)
      await expect(() => regencyService.getAll({province_id, start_index, limit})).rejects.toThrow()
      await expect(() => regencyService.getAll({province_id, start_index, limit})).rejects.toThrow("There are no regency registered")
      expect(findByAllMock).toHaveBeenCalled()
      expect(findByAllMock).toHaveBeenCalledWith({province_id, start_index, limit})
    });
  });

  describe("when call findById() method", () => {
    it('call with param existing id, should return regency data with same id', async () => {
      const id = regencies[0].id
      const regency = regencies.find(regency => regency.id === id) as MasterRegency
      const findByIdMock = jest.spyOn(regencyRepository, 'findById').mockResolvedValueOnce(regency)
      const response = await regencyService.findById(id)
      expect(response).toEqual(regency)
      expect(response?.id).toBe(id)
      expect(findByIdMock).toHaveBeenCalled()
      expect(findByIdMock).toHaveBeenCalledWith(id)
    });
    it('call with param non existing id, should return throw "Regency not found"', async () => {
      const id = '999999999'
      const district = null
      const findByIdMock = jest.spyOn(regencyRepository, 'findById').mockResolvedValueOnce(district)
      await expect(() => regencyService.findById(id)).rejects.toThrow()
      await expect(() => regencyService.findById(id)).rejects.toThrow("Regency not found")
      expect(findByIdMock).toHaveBeenCalled()
      expect(findByIdMock).toHaveBeenCalledWith(id)
    });
  })
})