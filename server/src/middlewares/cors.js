import cors from 'cors'

let corsOption = {
	origin: true,
	methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTION',
	credentials: true,
	exposedHeaders: ['x-auth-token']
}

const corsConfig = app => {
	app.use(cors(corsOption))
}

export default corsConfig
