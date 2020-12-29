const mpxLoaderConf = require('./mpxLoader.conf')
const mpxPluginConf = require('./mpxPlugin.conf')
const dllConf = require('./dll.conf')
const userConf = require('./user.conf')

const supportedModes = ['wx', 'ali', 'swan', 'qq', 'tt']

if (userConf.transWeb) {
  supportedModes.push('web')
}

module.exports = {
  userConf,
  dllConf,
  mpxLoaderConf,
  mpxPluginConf,
  supportedModes
}
