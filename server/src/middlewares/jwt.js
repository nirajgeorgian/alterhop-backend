import { verifyJwtToken } from '../resources/utils/jwt.auth'

export const verify = (req, res, next) => {
	if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
		console.log(req.headers.authorization.split(" ")[1])
		const token = req.headers.authorization.split(" ")[1]
		const payload = verifyJwtToken(token)
		if(payload !== null || payload !== undefined) {
			req.user = payload
		}
  } else {
		req.user = {}
	}
	next()
}
