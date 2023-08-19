const axios = require('axios')

/**
 * @returns {Promise<string>}
 */
module.exports = async function () {
  const packageName = 'micro-reactive'
  const registryUrl = `https://registry.npmjs.org/${packageName}`

  const response = await axios.get(registryUrl)

  return response.data['dist-tags'].latest
}
