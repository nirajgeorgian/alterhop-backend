import Sequelize from 'sequelize'
import redis from 'redis'
import mongoose from 'mongoose'

/*
	@redis connection
	create a redis client and connection is established
*/
const redisClient = redis.createClient(`${process.env.REDIS_SERVER_PORT}`, `${process.env.REDIS_HOST}`)
const redisConnect = new Promise((resolve, reject) => {
	redisClient.on('error', err => {
		// redis error
		console.log(`Error occured ${err.message()}`)
		reject(err.message())
		process.exit()
	})
	redisClient.on('connect', () => {
		console.log(`🚀 Connected to redis redis:6379`)
		resolve(redisClient)
	})
})

/*
	@postgress connection
	postgress connected with sequelize package
*/
// console.log(process.env);
const sequelize = new Sequelize(`${process.env.POSTGRES_DB}`, `${process.env.POSTGRES_USER}`, `${process.env.POSTGRES_PASSWORD}`, {
	host: `${process.env.POSTGRES_DB_HOST}`,
	dialect: `${process.env.POSTGRES_DB_DIALECT}`,
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	operatorsAliases: false
})

const sequelizeConnect = new Promise((resolve, reject) => {
	sequelize
		.authenticate()
		.then(() => {
			console.log(`🚀 Connected to ${process.env.POSTGRES_DB} postgress database successfully!!`)
			resolve(sequelize)
		})
		.catch(err => {
			// postgress connection error
			console.error(`Unable to connect to the database: ${err}`)
			reject(err)
		})
})

/*
	@mongodb connection
	Database connection for nosql database
*/
const mongoUrl = `${process.env.MONGO_HOST}/${process.env.MONGO_INITDB_DATABASE}`
const mongooseConnect = mongoose.connect(mongoUrl, { autoReconnect: true, useNewUrlParser: true, useCreateIndex: true })
const mongodb = mongoose.connection
const mongoConnect = new Promise((resolve, reject) => {
	mongodb.once('open', () => {
		console.log(`🚀 Connected to ${mongoUrl} nosql mongo database`)
		resolve(mongodb)
	})
	mongodb.on('error', () => {
		console.error(`error  connection to mongodb database`)
		reject(new Error("Error connection to mongodb"))
	})
})

const resolveAll = async () => {
	await mongoConnect
	await sequelizeConnect
	await redisConnect
}

export {
	mongodb,
	sequelize,
	redisClient,
	mongooseConnect,
	resolveAll
}
