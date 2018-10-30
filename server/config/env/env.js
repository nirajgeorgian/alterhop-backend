import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

const envConfig = async () => {
	const env = process.env.NODE_ENV
	// let envConfig
	switch(env) {
		case 'development':
		case 'dev':
			console.log("running on development environment")
			return await require('dotenv').config({ path: path.resolve(process.cwd(), 'config/env/.env.dev')})
			// envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), 'config/env/.env.dev')))
			break
		case 'testing':
		case 'test':
			console.log("running on test environment")
			return await require('dotenv').config({ path: path.resolve(process.cwd(), 'config/env/.env.test')})
			// envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), 'config/env/.env.test')))
			break
		case 'production':
		case 'prod':
			console.log("running on production environment")
			return await require('dotenv').config({ path: path.resolve(process.cwd(), 'config/env/.env.prod')})
			// envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), 'config/env/.env.prod')))
			break
		default:
			return await require('dotenv').config({ path: path.resolve(process.cwd(), 'config/env/.env.dev')})
			// envConfig = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), 'config/env/.env.dev')))
			break
	}
	// for (var k in envConfig) {
	//   process.env[k] = envConfig[k]
	// }
}
envConfig()

export default envConfig
