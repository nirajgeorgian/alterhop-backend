export const CompanyGraphqlSchema = `
  type Review {
    user_id: String!
    stars: Int!
    pros: [String]
    cons: [String]
    suggestions: String
  }
	enum TimingsUnits {
		DD
		WW
		MM
		YY
	}
	type TimingsInput {
		value: Int!
		units: String!
		per: TimingsUnits!
	}
  type Timings {
    fulltime: TimingsInput
    parttime: TimingsInput
    internship: TimingsInput
  }
  type OpenSource {
    title: String!
    description: String!
    url: String!
    languages: [String!]
    licence_type: String!
  }
  type Company {
    id: ID!
    name: String!
    desc: String!
    url: String
    logo: String
    location: String
    reviews: [Review!]
    timings: Timings
    compnay_since: String
    hiring_status: Boolean
    languages: [String!]
    no_of_employees: Int
    opensource: [OpenSource]
  }
	input CompanyDetails {
		created_by: ID
		name: String!
    desc: String!
    url: String
    logo: String
    location: String
    compnay_since: String
    hiring_status: Boolean
    languages: [String!]
    no_of_employees: Int
	}
  extend type Query {
    fetchCompany: Company
  }
	extend type Mutation {
		createCompany(input: CompanyDetails!): Company
	}
`
