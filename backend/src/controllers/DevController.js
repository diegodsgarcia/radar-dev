const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {
  async index(req, res) {
    const devs = await Dev.find()

    return res.json(devs)
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const response = await axios.get(`https://api.github.com/users/${github_username}`)

      const { name = login, avatar_url, bio } = response.data

      const techsArray = parseStringAsArray(techs)

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })

      const sendMessageSocketTo = findConnections(
        { latitude, longitude },
        techsArray,
      )

      sendMessage(sendMessageSocketTo, 'new-dev', dev)
    }

    return res.json(dev)
  },


  async delete(req, res) {
    const { id } = req.params
    const dev = await Dev.findByIdAndDelete({ _id: id })
    return res.json({ dev })
  }
}
