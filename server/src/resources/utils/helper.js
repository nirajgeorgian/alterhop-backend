/*
	@object, @[property]
	@return boolean
*/
const ObjectCheck = (obj, ...lists) => {
	// list is an array
	let result = true
	let keys = Object.keys(obj)
	lists.forEach(list => {
		if(!(keys.includes(list))) {
			result = false
			return
		}
	})
	return result
}

export {
	ObjectCheck
}
