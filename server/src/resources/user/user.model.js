import crypto from 'crypto'
import mongoose from 'mongoose'
import { mongodb } from '../../db'
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { required: true, type: String, required: true },
	phone: { type: String },
	address: { type: String },
	location: { type: String },
	profile_picture: { type: String },
	verified: { type: Boolean, default: false },
	social_urls: {
    facebook: { type: String, default: null },
		google: {	type: String, default: null },
		twitter: { type: String, default: null	},
		github: {	type: String, default: null },
		instagram: { type: String, default: null	},
		personal: {	type: String, default: null }
  },
	notification: {
		job_posting: { status: { type: Boolean, default: true } },
    company_promotion: { status: { type: Boolean, default: true } },
    comment: { status: { type: Boolean, default: true } },
		mail: { status: { type: Boolean, default: true } },
		message: { status: { type: Boolean, default: true } }
	},
	account: {
		account_type: { type: String, lowercase: true },
		subscription_type: { type: String, lowercase: true, default: 'free' },
	},
	ownedCompany: [{
		comp_id: { type: Schema.Types.ObjectId, ref: 'Company' }
	}],
	ownedOrganization: [{
		org_id: { type: Schema.Types.ObjectId, ref: 'Organization' }
	}],
	companyWorking: [{
		comp_id: { type: Schema.Types.ObjectId, ref: 'Company' }
	}],
	applyJob: [{
		apply_job_id: { type: Schema.Types.ObjectId, ref: 'ApplyJob' }
	}],
	jobs: [{
		job_id: { type: Schema.Types.ObjectId, ref: 'Jobs' },
		status: { type: String, lowercase: true }
	}],
	organization: { type: Schema.Types.ObjectId, ref: 'Organization' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

userSchema.statics.sendUser = function(user) {
	user.password = "**********************************"
	return user
}

/*
	Method's to encrypt and decrypt the password
	@params {password}
	@return {hashed password}
*/
userSchema.methods.hashPassword = function(length = 64) {
	const salt = new Buffer(new String(process.env.HASH_SECRET), 'base64')
	const key = crypto.pbkdf2Sync(this.password, salt, 100000, length, 'sha512')
	this.password = key.toString('hex')
	console.log(this.password)
	return true
}

userSchema.methods.verifyPassword = function(password, length = 64) {
	const salt = new Buffer(new String(process.env.HASH_SECRET), 'base64')
	const key = crypto.pbkdf2Sync(password, salt, 100000, length, 'sha512')
	console.log(key)
	console.log(this.password);
	if(this.password === key.toString('hex')) {
		return true
	}
	return false
}

export const User = mongodb.model('User', userSchema)
