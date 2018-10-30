export const UserGraphqlSchema = `
	type SocialUrls {
		facebook: String
		google: String
		twitter: String
		github: String
		instagram: String
		personal: String
	}
	type Status {
		status: Boolean!
	}
	type Notification {
		job_posting: Status!
		company_promotion: Status!
		message: Status!
		mail: Status!
		comment: Status!
	}
	enum SubscriptionTypeEnum {
		free
		starter
		premium
	}
	enum AccountTypeEnum {
		provider
		seeker
	}
	type Account {
		account_type: AccountTypeEnum!
		subscription_type: SubscriptionTypeEnum!
	}
	type User {
		id: ID!
		username: String!
		email: String!
		phone: String
		address: String
		location: String
		profile_picture: String
		verified: Boolean!
		created_at: String!
		updated_at: String!
		organization: Organization
		social_urls: SocialUrls!
		notification: Notification!
		account: Account!
	}
	type UserResult {
		status: Boolean!
		message: String!
		user: User
	}
	type Result {
		status: Boolean!
		message: String!
	}
	type PasswordReset {
		token: String
		confirm: Boolean
	}
	extend type Query {
		currentUser: User
		getMe: String
		checkEmail(email: String!): Result!
		checkUser(username: String!): Result!
		getAllUser: [User]!
		getUser(id: ID!): User
		notification(id: ID!): Notification
	}
	input AccountTypeInput {
		account_type: AccountTypeEnum!
		subscription_type: SubscriptionTypeEnum
	}
	input UserSignupCredInput {
		username: String!
		email: String!
		password: String!
		account: AccountTypeInput!
	}
	input UserLoginCredInput {
		username: String
		email: String
		password: String!
	}
	input UserCheckInput {
		email: String
		username: String
	}
	input TokenInput {
		token: String!
		email: String
		username: String
	}
	input ResetPasswordInput {
		token: String!
		email: String
		username: String
		password: String!
		againPassword: String!
	}
	extend type Mutation {
		signup(input: UserSignupCredInput!): UserResult!
		login(input: UserLoginCredInput!): Result!
		passwordToken(input: UserCheckInput!): Result!
		confirmToken(input: TokenInput!): Result!
		resetPassword(input: ResetPasswordInput!): Result!
		changeUsername(input: UserCheckInput!): Result!
	}
`
