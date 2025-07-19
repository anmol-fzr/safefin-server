import { Hono } from 'hono'
import { Country, State, City } from "country-state-city"

const addressRouter = new Hono()

addressRouter.get('/country', async (c) => {
  const countries = Country.getAllCountries().map((country) => ({
    name: country.name,
    isoCode: country.isoCode
  }))

  return c.json({ data: countries })
})

addressRouter.get('/state/:countryCode', async (c) => {
  const countryCode = c.req.param("countryCode")
  const states = State.getStatesOfCountry(countryCode).map((state) => ({
    name: state.name,
    isoCode: state.isoCode
  }))

  return c.json({ data: states })
})

addressRouter.get('/city/:stateCode/:countryCode', async (c) => {
  const countryCode = c.req.param("countryCode")
  const stateCode = c.req.param("stateCode")

  const cities = City.getCitiesOfState(countryCode, stateCode).map((state) => ({
    name: state.name,
  }))

  return c.json({ data: cities })
})

export { addressRouter }
