const Sentry = require('@sentry/node')
import compression from 'compression'
import bodyParser from 'body-parser'
import { GraphQLError } from 'graphql'
import { AuthenticationError, ApolloError, ForbiddenError } from 'apollo-server-express'

/*
Sentry configuration for error tracking ...
 */
Sentry.init({
  dsn: 'https://1730b0d8433a4912a2a01807f48cf908@sentry.io/1278141',
	maxBreadcrumbs: 50,
  debug: true,
	environment: 'staging'
})

/*
	middleware
*/
import toobusy from './toobussy'
import security from './security'
import ignoreRequest from './ignReq'
import cors from './cors'
import hosts from './hosts'
import { verify } from './jwt'

export default app => {
	app.use(Sentry.Handlers.requestHandler()) // The request handler must be the first middleware on the app
	app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
	app.use(bodyParser.json()) // parse application/json
	app.set('trust proxy', true) // run it also behind proxy
	app.use(toobusy)
	security(app)
	ignoreRequest(app)
	cors(app)
	app.use(compression())
	app.use('/graphql', verify)
	app.use(Sentry.Handlers.errorHandler()) // The error handler must be before any other error middleware
	app.use(function (err, req, res, next) {
	  if (err.name === 'UnauthorizedError') {
			console.log("auth error")
			Sentry.captureException(err)
			next()
	  }
		next()
	})
	// hosts(app)
}
