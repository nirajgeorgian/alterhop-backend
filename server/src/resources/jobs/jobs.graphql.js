export const JobsGraphqlSchema = `
  enum CurrentStatus {
    active
    hold
    expired
    closed
    urgent
  }
  type Resume {
    path: String!
    user_id: String!
  }
  type Job {
    id: String!
    name: String!
    type: String!
    category: [String!]
    desc: String!
    skills_required: [String!]
    sallary_min: Float!
    sallary_max: Float!
    location: String
    attachment: String
    resume: Resume
    current_status: CurrentStatus!
    views: Int
		created_by: String
		company: String
		organization: String
		profile: String
    applyJob: [ApplyJob!]
  }
  extend type Query {
    fetchJob: Job
  }
	input createJobInput {
		name: String!
		type: String!
		desc: String!
		skills_required: [String]
		sallary_min: Float!
		sallary_max: Float!
		location: String
		profile: String
		company: String
	}
	extend type Mutation {
		jobCreate(input: createJobInput!): Job!
	}
`
