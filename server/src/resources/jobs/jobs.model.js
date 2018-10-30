import mongoose from 'mongoose'
import { mongodb } from '../../db'
const Schema = mongoose.Schema

const jobSchema = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	desc: { type: String, required: true },
	skills_required: [ { type: String } ],
	sallary_min: { value: { type: Number }, currency: { type: String } },
	sallary_max: { value: { type: Number }, currency: { type: String } },
	location: { type: String },
	attachment: [{ "type": { type: String },file: { type: String } }],
	resume: { path: { type: String }, user_id: { type: Schema.Types.ObjectId, ref: 'User'} },
	current_status: { type: String, lowercase: true },
	views: { type: Number, default: 0 },
	applyJob: [{
		type: Schema.Types.ObjectId,
		ref: 'ApplyJob'
	}],
	created_by: { type: Schema.Types.ObjectId, ref: 'User' },
	company: { type: Schema.Types.ObjectId, ref: 'Company' },
	organization: { type: Schema.Types.ObjectId, ref: 'Organization' },
	profile: { type: String, default: 'company' }
})

export const Jobs = mongodb.model('Jobs', jobSchema)


/*
	milestone: [
		{
			key: {
				type: Number
			},
			value: {
				type: String
			}
		}
	],
*/
