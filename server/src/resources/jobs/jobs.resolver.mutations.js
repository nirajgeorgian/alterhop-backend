import { AuthenticationError, ApolloError } from 'apollo-server-express'
import { JobsGraphqlSchema } from './jobs.graphql'
import { Jobs } from './jobs.model'
import { User } from '../user/user.model'

export const jobCreate = async (_, {input}, {mongodb, user}) => {
	// validate the job creation before creating job
	/*
		check weather the user is logged in or not
	*/
	if(!user.username) {
		throw new AuthenticationError("must authenticate")
	}
	// check that the account type should be creator
	if(user.account_type !== 'provider') {
		throw new ApolloError('Your account must have provider credential rather than seeker', 3)
	}
	// check to find old jobs with this name
	// const oldJob = Jobs.findOne({ name: input.name })
	// if(oldJob) {
	// 	throw new ApolloError("Job already exists", 2)
	// }
	/*
		fetch the current user and get the organization from it
	*/
	const currentUser = await User.findById(user.id)
	const job = new Jobs({
		name: input.name,
		type: input.type,
		desc: input.desc,
		skills_required: input.skills_required ? input.skills_required : null,
		sallary_min: input.sallary_min ? input.sallary_min : null,
		sallary_max: input.sallary_max ? input.sallary_max : null,
		location: input.location ? input.location : null,
		created_by: user.id,
		profile: input.profile,
		[input.profile]: currentUser.organization
	})
	const checkJob = currentUser.jobs.find(job => {
		if(job.name === input.name) {
			throw new ApolloError("Job already exists for this organization", 2)
		}
	})
	const savedJob = await job.save()
	currentUser.jobs.push({
		job_id: savedJob.id,
		status: 'active'
	})
	return savedJob
}

export const JobMutation = {
	Mutation: {
		jobCreate
	}
}
