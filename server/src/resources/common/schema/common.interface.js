export const CommonInterfaceSchema = `
interface UserDetailsInterface {
	phone: String
	address: String
	location: String
	profile_picture: String
	verified: Boolean!
}
interface TimeStampInterface {
	created_at: String!
	updated_at: String!
}
`
