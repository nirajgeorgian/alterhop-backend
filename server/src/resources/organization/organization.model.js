import mongoose from 'mongoose'
import { mongodb } from '../../db'
const Schema = mongoose.Schema

const OrganizationSchema = new Schema({
	created_by: {
		type: Schema.Types.ObjectId, ref: 'User'
	},
	name: { type: String, unique: true, required: true },
	desc: { type: String, required: true },
	url: { type: String, lowercase: true },
	address: { type: String },
	phoneno: { type: String },
	org_type: [{ type: String }],
	organization_since: { type: Date },
	last_seen: { type: Date },
	no_of_employees: { min: Number, max: Number },
	logo: { type: String },
	languages: [{ type: String }],
	location: { type:String },
	reviews: [{
		rev_id: { type: Schema.Types.ObjectId, ref: 'Reviews' }
	}],
	no_of_employees: { min: { type: Number, default: null }, max: { type: Number, default: null } },
	hiring_status: {type: Boolean, default: false },
	opensource: [{
		open_source_id: { type: Schema.Types.ObjectId, ref: 'OpenSource'}
	}]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

OrganizationSchema.pre('find', function() {
	this.populate('created_by')
})

export const Organization = mongodb.model('Organization', OrganizationSchema)
