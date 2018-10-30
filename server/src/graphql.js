const {promisify} = require('util')
const Sentry = require('@sentry/node')
import LogRocket from 'logrocket'
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express'
import createGraphQLLogger from 'graphql-log'
import { merge } from 'lodash'
import { mongodb, redisClient, sequelize } from './db'

/*
LogRocket entry configuration ...
 */
LogRocket.init('oojob/server')
Sentry.configureScope(scope => {
  scope.addEventProcessor(async (event, hint) => {
    event.extra.sessionURL = LogRocket.sessionURL
    return event
  })
})

/*
	import graphql schema
*/
import { UserGraphqlSchema } from './resources/user/user.graphql'
import { ApplyJobGraphqlSchema } from './resources/applyJob/applyJob.graphql'
import { JobsGraphqlSchema } from './resources/jobs/jobs.graphql'
import { CompanyGraphqlSchema } from './resources/company/company.graphql'
import { OrganizationGraphqlSchema } from './resources/organization/organization.graphql'
import { PaymentGraphqlShema } from './resources/payment/payment.graphql'
import { EmailGraphqlSchema } from './resources/email/email.graphql'

/*
	import graphql resolvers
*/
import { EmailResolvers } from './resources/email/email.resolver'

/*
	import mutations
 */
import { UserMutations } from "./resources/user/user.resolver.mutations";
import { CompanyMutations } from './resources/company/company.resolver.mutations'
import { OrganizationMutation } from './resources/organization/organisation.resolver.mutations'
import { JobMutation } from './resources/jobs/jobs.resolver.mutations'

/*
 import Query functions
 */
import { UserQuery } from "./resources/user/user.resolver.query";

const root  = gql`
	type Query {
		dummy: String
	}
	type Mutation {
		dummy: String
	}
	type Subscription {
		dummy: String
	}
	schema {
		query: Query
		mutation: Mutation
		subscription: Subscription
	}
`

const resolvers = merge(
	{
		Query: {
			dummy: (obj, args, context, info) => {
				return `Hello World`
			}
		}
	},
	// All queries and mutations goes here
	UserMutations,
	CompanyMutations,
	OrganizationMutation,
	JobMutation,
	UserQuery,
	EmailResolvers
)

const typeDefs = [
	root,
	UserGraphqlSchema,
	ApplyJobGraphqlSchema,
	JobsGraphqlSchema,
	CompanyGraphqlSchema,
	OrganizationGraphqlSchema,
	PaymentGraphqlShema,
	EmailGraphqlSchema
]

/* create a graphql logger */
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
	const logExecutions = createGraphQLLogger({
		prefix: 'resolvers : '
	})
	logExecutions(resolvers)
}

const getAsync = promisify(redisClient.get).bind(redisClient)
export const GraphQLServer = new ApolloServer({
	typeDefs,
	resolvers,
	formatError: err => {
		Sentry.captureException(err)
    return {
      message: err.message,
      code: err.extensions && err.extensions.code,   // <--
      locations: err.locations,
      path: err.path ? err.path : "path not defined"
    }
  },
	context: ({ req, res }) => {
		return {
			req, mongodb, redisClient, sequelize, getAsync, user: req.user
		}
	},
	playground: {
		settings: {
	    'editor.theme': 'light',
	  }
	},
	// enable playground and introspection in production
	introspection: true,
	tracing: true,
	cacheControl: true,
	engine: false
})
