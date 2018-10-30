import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'


// sign the request
const privateCert = fs.readFileSync(path.resolve(__dirname, 'private.key'))
export const generateJwtToken = (payload, cert = privateCert) => {
	return jwt.sign(
		payload,
		cert,
		{
			algorithm: 'RS256',
			expiresIn: '30d'
		}
	)
}

// verify the request
const publicCert = fs.readFileSync(path.resolve(__dirname, 'public.key'))
export const verifyJwtToken = (token, cert = publicCert) => {
	try {
		return jwt.verify(
			token,
			cert
		)
	} catch(e) {
		console.log(e)
	}
}
