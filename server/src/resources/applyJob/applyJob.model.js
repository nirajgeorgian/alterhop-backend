import mongoose from 'mongoose'
import { mongodb } from '../../db'
const Schema = mongoose.Schema

const applyJobSchema = new Schema({
	// job_id: { type: Schema.Types.ObjectId, ref: 'Jobs' },
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	users: [{
		// user_id: { type: Schema.Types.ObjectId, ref: 'User'},
		// resume: { path: String, user_id: { type: Schema.Types.ObjectId, ref: 'User'}},
		proposal: { type: String },
		applied_on: { type: Date }
	}],
	vacancy: { type: Number },
	notification_on_job_apply: { type: Number, default: -1 }
})

export const ApplyJob = mongodb.model('ApplyJob', applyJobSchema)
