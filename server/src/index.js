import env from '../config/env/env' /* environment variable setup */
import http from 'http'
import cluster from 'cluster'
import os from 'os'
import app, { GraphQLEngine, GraphQLServer} from './server' /* create server */
export const port = process.env.API_SERVER_PORT || 8080 /* dynamically port configuration */
const numCPUs = os.cpus().length

if(cluster.isMaster) {
	console.log(`Master ${process.pid} is running`)

	// Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

	cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  })
} else {
	const server = http.createServer(app)
	let currentApp = app
	GraphQLEngine.listen({
		port: port,
		httpServer: server,
		logging: {
			level: "ERROR" // Engine Proxy logging level. DEBUG, INFO (default), WARN or ERROR.
		}
	})
	console.log(`Worker ${process.pid} started`)
	console.log(`🚀 All Database connected successfully`)
	console.log(`🚀 Server ready at http://localhost:${port}${GraphQLServer.graphqlPath}`)

	if(module.hot) {
		module.hot.accept('./server', () => {
			server.removeListener('request', currentApp)
			server.on('request', app)
			currentApp = app
		})
	}
}
