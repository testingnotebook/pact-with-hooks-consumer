const axios = require('axios')
const adapter = require('axios/lib/adapters/http')
const product = require('./product')

axios.defaults.adapter = adapter

const generateAuthToken = () => {
  return 'Bearer ' + new Date().toISOString()
}

const getProduct = async (url, id) => {
  return axios
    .get(`${url}/product/` + id, {
      headers: {
        Authorization: generateAuthToken(),
      },
    })
    .then((r) => product(r.data))
}

module.exports = getProduct
