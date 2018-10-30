import { AuthenticationError } from 'apollo-server-express'
import redis from "redis";
import {User} from "./user.model";
import {generateResult} from "../utils/resuleGenerate";
import {generateUser} from '../utils/resultUser'
import { generateJwtToken } from '../utils/jwt.auth'
import {generateToken} from "../utils/tokenGenerate";

/**
 * @params { email, username, password }
 * @return { success, message }
 * Mutation to create user
 */
const signup = async (_, {input}, {mongodb}) => {
	/*
		// Validate before inserting
	const result = ObjectCheck(input, "email", "password", "username", "account")
	if(!result) {
		return generateResult(false, "Please pass all required argument")
	}
	*/
	const oldUser = await User.findOne({ $or: [{email: input.email}, { username: input.username}]})
	if(oldUser) {
		return generateUser(false, "Email or Username is already taken")
	}
	const user = new User(input)
	user.hashPassword()
	const newUser = await user.save()
	return generateUser(true, "successfully created user", newUser)
}


/**
 * @params { username, password }
 * @return { success, message }
 * Mutation to login user
 */
const login = async (_, {input}) => {
	const user = await User.findOne({ $or: [{email: input.email}, { username: input.username}]})
	if(!user) {
		return generateResult(false, "No user exist with this username or email address")
	}
	const verified = user.verifyPassword(input.password)
	if(!verified) {
		return generateResult(false, "Password Wrong.")
	}
	const payload = {id: user.id, email: user.email, username: user.username, account_type: user.account.account_type}
	const token = "Bearer " + generateJwtToken(payload)
	return generateResult(true, token)
}


/**
 * @params { email, username }
 * @return { success, message }
 * Mutation to create password reset token
 */
const passwordToken = async (_, { input }, { redisClient }) => {
	const email = input.email ? input.email : ''
	const username = input.username ? input.username : ''
	const user = await User.findOne({ $or: [{ email: email }, { username: username }]})
	if(!user) {
		if(email === '' && username === '') {
			return generateResult(false, `Please pass email or username`)
		}
		if(email !== '') {
			return generateResult(false, `no user exist for this ${email}`)
		}
		if(username !== '') {
			return generateResult(false, `no user exist for this ${username}`)
		}
	}
	const token = generateToken(50)
	if(email !== '') {
		redisClient.set(`${email}-password-reset`, token, redis.print)
	}
	if(username !== '') {
		redisClient.set(`${username}-password-reset`, token, redis.print)
	}
	return generateResult(true, token)
}


/**
 * @params { token, username, email }
 * @return { success, message }
 * Mutation to confirm password reset token and generate token for updating password
 */
const confirmToken = async (_, { input }, { redisClient, getAsync }) => {
	const token = input.token
	const email = input.email ? input.email : ''
	const username = input.username ? input.username : ''
	let key = null
	if(email !== '') {
		key = `${email}-password-reset`
	}
	if(username !== '') {
		key = `${username}-password-reset`
	}
	if(key !== null) {
		const isKey = redisClient.get(key, redis.print)
		if(!isKey) {
			return generateResult(false, "no value for provider key")
		}
	}
	const user = await User.findOne({$or: [{ email: email }, { username: username }]})
	if(!user) {
		if(email === '' && username === '') {
			return generateResult(false, `Please pass email or username`)
		}
		if(email !== '') {
			return generateResult(false, `no user exist for this ${email}`)
		}
		if(username !== '') {
			return generateResult(false, `no user exist for this ${email}`)
		}
	}
	const data = await getAsync(key)
	if(data !== token || data === null) {
		return generateResult(false, "Please pass valid token")
	}
	// data is equal to token
	redisClient.del(key)
	const newToken = generateToken(50)
	if(email !== '') {
		redisClient.set(`${email}-password-token`, newToken, redis.print)
	}
	if(username !== '') {
		redisClient.set(`${username}-password-token`, newToken, redis.print)
	}
	return generateResult(true, newToken)
}


/**
 * @params { token, againPassword, password }
 * @return { success, message }
 * Mutation to confirm reset password with token
 */
const resetPassword = async (_, { input }, { redisClient, getAsync }) => {
	const email = input.email ? input.email : ''
	const username = input.username ? input.username : ''
	const token = input.token
	let key = null
	if(email !== '') {
		key = `${email}-password-token`
	}
	if(username !== '') {
		key = `${username}-password-token`
	}
	const user = await User.findOne({$or: [{ email: email }, { username: username }]})
	if(!user) {
		if(email === '' && username === '') {
			return generateResult(false, `Please pass email or username`)
		}
		if(email !== '') {
			return generateResult(false, `no user exist for this ${email}`)
		}
		if(username !== '') {
			return generateResult(false, `no user exist for this ${username}`)
		}
	}
	const data = await getAsync(key)
	if(data !== token || data === null) {
		return generateResult(false, "Please pass valid token")
	}
	if(input.password !== input.againPassword) {
		return generateResult(false, "Wrong password match.")
	}
	user.password = input.password
	user.hashPassword()
	await user.save()
	redisClient.del(key)
	return generateResult(true, "Successfully updated the password")
}


/**
 * @params { email, username }
 * @return { success, message }
 * Mutation to create username or email (unique across the database)
 */
const changeUsername = async (_, { input }, { redisClient, getAsync, user}) => {
	// Check for authentication before proceding
	if(!user.username) {
		// throw auth error
		throw new AuthenticationError('must authenticate')
	}
	const email = input.email ? input.email : ''
	const username = input.username ? input.username : ''
	if(email === '' && username === '') {
		return generateResult(false, `Please pass email or username`)
	}
	const returnUser = await User.findOne({$or: [{ email: email }, { username: username }]})
	if(returnUser) {
		if(email !== '') {
			if(user.email === returnUser.email) {
				return generateResult(true, "You updated your own email")
			}
			return generateResult(false, `user exist for this ${email}`)
		}
		if(username !== '') {
			if(user.username === returnUser.username) {
				return generateResult(true, "You updated your own username")
			}
			return generateResult(false, `user exist for this ${username}`)
		}
	}
	// user does not exist with the provided detals so let's proceed with update
	if(username !== '') {
		// Check weather previous user exist's or not
		const sameUserReturn = await User.findOne({ email: user.email })
		sameUserReturn.username = username
		await sameUserReturn.save()
	}
	if(email !== '') {
		// Check weather previous user exist's or not
		const sameUserReturn = await User.findOne({ username: user.username })
		sameUserReturn.email = email
		await sameUserReturn.save()
	}
	return generateResult(true, "Successfully updated")
}

export const UserMutations = {
	Mutation: {
		signup,
		login,
		passwordToken,
		confirmToken,
		resetPassword,
		changeUsername
	}
}
