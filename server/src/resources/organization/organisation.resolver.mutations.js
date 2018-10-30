import  { AuthenticationError, UserInputError, ApolloError } from 'apollo-server-express'
import { Organization } from './organization.model'
import { User } from '../user/user.model'


const createOrganisation = async (_, { input }, { user }) => {
	if(!user || !user.username || user === undefined) {
		throw new AuthenticationError('must authenticate')
	}
	// check that the account type should be creator
	if(user.account_type !== 'provider') {
		throw new ApolloError('Your account must have provider credential rather than seeker', 3)
	}
	const oldCompany = await Organization.findOne({ name: input.name })
	if(oldCompany) {
		throw new ApolloError("Organization already exists", 2)
	}
	const loggedInUser = await User.findById(user.id)
	const organization = new Organization(input)
	organization.created_by = user.id
	const newOrganization = await organization.save()
	loggedInUser.ownedOrganization.push({
		org_id: newOrganization.id
	})
	loggedInUser.organization = newOrganization.id
	await loggedInUser.save()
	return newOrganization
}

export const OrganizationMutation = {
	Mutation: {
		createOrganisation
	}
}
