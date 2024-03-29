export const EmailGraphqlSchema = `
	type Email {
		id: ID!
		to: String!
		from: String!
		subject: String!
		text: String!
	}
	input ClientEmail {
		to: String!
		from: String!
		subject: String!
		text: String!
	}
	input emailCred {
		username: String!
		email: ClientEmail
	}
	extend type Query {
		allEmails: [Email]!
		userEmails: [Email]!
		singleEmail: Email!
	}
	extend type Mutation {
		sendMail(input: emailCred): Boolean!
	}
`
