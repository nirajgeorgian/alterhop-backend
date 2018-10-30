import express from 'express'
const { ApolloEngine } = require("apollo-engine")
import { auth } from './middlewares/jwt'
import { GraphQLServer } from './graphql'
import { resolveAll } from './db'
const app = express()

/*
import for config custom middlewares
*/
import middlewares from './middlewares/index'
middlewares(app)

resolveAll() /* resolves all database connections */
/*
import for config custom modules
*/
import config from '../config/index'
config(app)

//Mount a jwt or other authentication middleware that is run before the GraphQL execution
// app.use('/graphql', auth)
GraphQLServer.applyMiddleware({ /* graphql configuration */
	app,
	path: '/graphql'
})

const GraphQLEngine = new ApolloEngine({
	apiKey: process.env.APOLLO_ENGINE_KEY
})

export {
	GraphQLServer,
	GraphQLEngine
}
export default app
