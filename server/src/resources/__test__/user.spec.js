import { env } from './index'
import assert from 'assert'
import mongoose from 'mongoose'
import { expect } from 'chai'
import { mongodb, mongooseConnect } from '../../db'
import OpenSource from '../common/opensource.model'
import Reviews from '../common/reviews.model'
import Company from '../company/company.model'
import { ApplyJob } from '../applyJob/applyJob.model'
import Job from '../jobs/jobs.model'
import { User } from '../user/user.model'

describe('User Model', () => {
	const email = 'johndoe@example.com'
	beforeEach(async () => {
		await User.deleteMany({})
		let user = new User({
			username: "johndoe",
			email: "johndoe@example.com",
			password: "johndoeN9"
		})
		return await user.save()
	})

	describe('find creted user', () => {
		it('should return appropiate datatype', async () => {
			const data1 = await User.findOne({email: email})
			expect(data1).to.be.a('object')
			const data2 = await User.find({ email: email})
			expect(data2).to.be.a('array')
		})

		it('should return the user', async () => {
			const data = await User.findOne({email: email})
			assert.equal(email, data.email)
		})

		it(`should return user with email ${email}`, async () => {
			const data = await User.find({ email: email})
			assert.equal(email, data[0].email)
		})

		it('should update the user', async () => {
			const data = await User.findOne({email: email})
			data.phone = '9182711836'
			data.location = 'Hyderabad'
			data.profile_type = 'Basic'
			data.account_type = 'Provider'
			await data.save()
			const user = await User.findOne({email: email})
			assert(user.phone, '9182711836')
		})

		it('should update social links', async () => {
			const data = await User.findOne({email: email})
			data.social_links.facebook = 'facebook.com'
			data.social_links.google = 'google.com'
			data.social_links.twitter = 'twitter.com'
			data.social_links.github = 'github.com'
			data.social_links.instagram = 'instagram.com'
			data.social_links.personal = 'personal.me'
			await data.save()
			const user = await User.findOne({email: email})
			assert.equal(user.social_links.facebook, 'facebook.com')
		})

		// it('should show data', async () => {
		// 	const data = await User.findOne({email: email})
		// 	console.log(data)
		// })
	})

})
