// # mutation createUser($input: UserSignupCred!) {
// #   user: signup(input: $input) {
// #   	username
// #   }
// # }
//
// # mutation ChangeUsername($input: UserCheck!) {
// #   username: changeUsername(input: $input) {
// #     message
// #     success
// #   }
// # }
//
// # mutation login($input: UserLoginCred!) {
// #   loggedin: login(input: $input) {
// #     success
// #     message
// #   }
// # }
//
// # mutation generateToken($input: UserCheck!) {
// #   token: passwordToken(input: $input) {
// #     success
// #     message
// #   }
// # }
//
// # mutation confirmToken($input: Token!) {
// #   token: confirmToken(input: $input) {
// #     success
// #     message
// #   }
// # }
//
// # mutation resetPassword($input: ResetPassword!) {
// #   token: resetPassword(input: $input) {
// #     success
// #     message
// #   }
// # }
//
// # {
// #   "input": {
// #     "email": "test@example.com",
// #     "username": "test"
// #   }
// # }
