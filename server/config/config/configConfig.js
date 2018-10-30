// import config and make it available globally
const configConfig = () => {
  const env = process.env.NODE_ENV
  let config
  // import configuration from config
	switch(env) {
		case 'development':
      config = require('../../config/config/configFiles/config.dev')
      global.config = config
		case 'testing':
      config = require('../../config/config/configFiles/config.test')
      global.config = config
		case 'production':
      config = require('../../config/config/configFiles/config.prod')
      global.config = config
		default:
      config = require('../../config/config/configFiles/config.dev')
      global.config = config
	}
}

export default configConfig
