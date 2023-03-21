import { IHealthcheckRepository } from "../contracts"
import { HealthCheckService } from "../HealthCheckService"


let healthCheckRepository:IHealthcheckRepository

beforeEach(() => {

  healthCheckRepository = {
    getHealthWms: jest.fn().mockResolvedValue(false),
    getHealthEvo: jest.fn().mockResolvedValue(false)
  } as unknown as IHealthcheckRepository

}) 

describe("HealthCheckService", () => {
  describe("getHealthCheck", () => {
    it("should return  db_warehouse false if db_warehouse not connect", async() => {
      const healthCheckService = new HealthCheckService(
        healthCheckRepository
      )
      const bodyResult ={
        db_warehouse: false,
        db_evo: true
      }
      
      healthCheckRepository.getHealthEvo = jest.fn().mockResolvedValue(true)
      await expect(healthCheckService.getHealthCheck()).resolves.toStrictEqual(bodyResult)
    })

    it("should return db_evo false if db_evo not connect", async() => {
      const healthCheckService = new HealthCheckService(
        healthCheckRepository
      )
      const bodyResult ={
        db_warehouse: true,
        db_evo: false
      }
      healthCheckRepository.getHealthWms = jest.fn().mockResolvedValue(true)
      await expect(healthCheckService.getHealthCheck()).resolves.toStrictEqual(bodyResult)
    })

    it("should return db_warehouse and db_evo false if db_evo and db_warehouse not connect", async() => {
      const healthCheckService = new HealthCheckService(
        healthCheckRepository
      )
      const bodyResult ={
        db_warehouse: false,
        db_evo: false
      }
      
      await expect(healthCheckService.getHealthCheck()).resolves.toStrictEqual(bodyResult)
    })

    it("should return db_warehouse and db_evo true if db_evo and db_warehouse  connect", async() => {
      const healthCheckService = new HealthCheckService(
        healthCheckRepository
      )
      const bodyResult ={
        db_warehouse: true,
        db_evo: true
      }

      healthCheckRepository.getHealthEvo = jest.fn().mockResolvedValue(true)
      healthCheckRepository.getHealthWms = jest.fn().mockResolvedValue(true)
      await expect(healthCheckService.getHealthCheck()).resolves.toStrictEqual(bodyResult)
    })
  })

})
