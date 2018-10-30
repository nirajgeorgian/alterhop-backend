export const ApplyJobGraphqlSchema = `
	type UsersInApplyJob {
		user_id: String!
		resume: Resume!
		proposal: String!
		applied_on: String!
	}
	type ApplyJob {
		job_id: String!
		likes: Int
		dislikes: Int
		users: [UsersInApplyJob!]
		vacancy: Int
		notification_on_job_apply: Int
	}

	extend type Query {
		fetchApplyJob: ApplyJob
	}
`
