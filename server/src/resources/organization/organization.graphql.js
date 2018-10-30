export const OrganizationGraphqlSchema = `
	type Organization {
		id: String!
		name: String!
		desc: String!
		url: String
		address: String
		phoneno: String
		org_type: [String!]
		organization_since: String
		no_of_member: Int
		logo: String
		languages: [String!]
		reviews: [Review]
		created_at: String!
		updated_at: String!
		hiring_status: Boolean
		no_of_employees: Int
		opensource: [OpenSource]
		location: String
		created_by: User!
	}
	input OrganizationDetails {
		created_by: ID
		name: String!
    desc: String!
    url: String
    logo: String
    location: String
    organization_since: String
    hiring_status: Boolean
    languages: [String!]
    no_of_employees: Int
	}
  extend type Query {
    fetchOrganization: Organization
  }
	extend type Mutation {
		createOrganisation(input: OrganizationDetails!): Organization
	}
`
