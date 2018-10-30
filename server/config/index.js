// Import configuration file and make it available according to the environment
import configConfig from './config/configConfig'
import logs from './logs/logs'

export default app => {
	/*
		configuration for application (not every)
	*/
	configConfig()
	logs(app)
}
