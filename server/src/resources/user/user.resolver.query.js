import redis from 'redis'
import  { AuthenticationError } from 'apollo-server-express'
import { User } from './user.model'
import { Organization } from '../organization/organization.model'

/* Util method's here */
import { generateToken } from '../utils/tokenGenerate'
import { generateResult } from '../utils/resuleGenerate'
import { ObjectCheck } from '../utils/helper'

/**
 * Below are the Query Functions
 */

/**
 * @params { email }
 * @return { success, message }
 * Query to check email exists's or not
 */
const checkEmail = async (_, { email }) => {
	const user = await User.findOne({ email: email })
	if(!user) {
		return generateResult(false, "no use exist for it")
	}
	return generateResult(true, "email exists")
}


/**
 * @params { email }
 * @return { success, message }
 * Query to check username exists's or not
 */
const checkUser = async (_, { username }) => {
	const user = await User.findOne({ username: username })
	if(!user) {
		return generateResult(false, "no user exist for it")
	}
	return generateResult(true, "username exists")
}


const currentUser = async (_, __, { user }) => {
	if(user == undefined || !user.username) {
		throw new AuthenticationError('must authenticate')
	}
	const ruser = await User.findById(user.id)
	if(!ruser) {
		return generateResult(false, "System Error")
	}
	return ruser
}


const getUser = async (_, { id }, { user }) => {
	if(!user || !user.username) {
		throw new AuthenticationError('must authenticate')
	}
	const ruser = await User.findById(id).populate('organization').populate('organization.created_by')
	if(!ruser) {
		return generateResult(false, "System Error")
	}
	return ruser
}


const getAllUser = async (_, __, { user }) => {
	const users = await User.find({})
	return users
}


export const UserQuery = {
	Query: {
		getMe: () => "New User",
		checkEmail,
		checkUser,
		currentUser,
		getUser,
		getAllUser
	},
	User: {
		notification: (rootUser) => {
			// make query for nested fields inside user
			return {
				job_posting: {
					status: rootUser.notification.job_posting.status
				},
				company_promotion: {
					status: rootUser.notification.company_promotion.status
				},
				message: {
					status: rootUser.notification.message.status
				},
				mail: {
					status: rootUser.notification.mail.status
				},
				comment: {
					status: rootUser.notification.comment.status
				}
			}
		},
		account: (rootUser) => {
			return rootUser.account
		},
		social_urls: (rootUser) => {
			return rootUser.social_urls
		},
		organization: (rootUser) => {
			return rootUser.organization
		}
	}
}
