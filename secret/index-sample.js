const { isProd } = require('../config')

exports.cookie = 'TODO'

exports.opbeat = {
  appId: 'TODO',
  organizationId: 'TODO',
  secretToken: 'TODO'
}

exports.db = {
  client: 'mysql',
  version: '5.7',
  connection: {
    host: isProd ? 'TODO' : 'TODO',
    user: 'TODO',
    password: 'TODO',
    database: 'TODO'
  }
}
