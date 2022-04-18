const { Pact } = require('@pact-foundation/pact')
const getProduct = require('./api')
const { Matchers } = require('@pact-foundation/pact')
const product = require('./product')
const { like, regex } = Matchers

const mockProvider = new Pact({
  consumer: 'pactflow-example-consumer',
  provider: 'pactflow-example-provider',
})

describe('API Pact test', () => {
  beforeAll(() => mockProvider.setup())
  afterEach(() => mockProvider.verify())
  afterAll(() => mockProvider.finalize())

  describe('retrieving a product', () => {
    it('ID 10 exists', async () => {
      const expectedProduct = {
        id: '10',
        type: 'CREDIT_CARD',
        name: '28 Degrees',
      }

      await mockProvider.addInteraction({
        state: 'a product with ID 10 exists',
        uponReceiving: 'a request to get a product',
        withRequest: {
          method: 'GET',
          path: '/product/10',
          headers: {
            Authorization: like('Bearer 2019-01-14T11:34:18.045Z'),
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': regex({
              generate: 'application/json; charset=utf-8',
              matcher: 'application/json;?.*',
            }),
          },
          body: like(expectedProduct),
        },
      })

      const p = await getProduct(mockProvider.mockService.baseUrl, '10')

      expect(p).toStrictEqual(product(expectedProduct))
    })
  })
})
