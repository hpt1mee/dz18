const person = document.querySelector('.persons')
const search = document.querySelector('.search')
const find = document.querySelector('.find')
const add = document.querySelector('.add')
const filterAge = document.querySelector('.filter-age')
const filterCity = document.querySelector('.filter-city')

async function deleteUser(userId) {
	const response = await fetch(`http://localhost:3000/deleteUser/${userId}`, {
		method: 'DELETE',
	})
	if (response.ok) {
		await renderPersons()
	}
}

const getDataFunction = async url => {
	const getData = async url => {
		const res = await fetch(url)
		const json = await res.json()
		return json
	}

	try {
		const data = await getData(url)
		return data
	} catch (error) {
		console.log(`Произошла ошибка в getData, ${error.message}`)
	}
}

async function renderPersons(filteredData = null) {
	const data = await getDataFunction('http://localhost:3000/getUsers')
	const users = filteredData || data.USERS
	person.innerHTML = ''
	users.forEach(user => {
		person.insertAdjacentHTML(
			`beforeend`,
			`<div class="person" data-id=${user.id}>
					${user.name} ${user.age} ${user.city}
					<button class="delete" onclick="deleteUser('${user.id}')"></button>
				</div>`
		)
	})
}

find.addEventListener('click', async () => {
	const searchValue = search.value.trim()
	const ageValue = filterAge.value.trim()
	const cityValue = filterCity.value.trim()

	const data = await getDataFunction('http://localhost:3000/getUsers')
	let filteredData = data.USERS

	if (searchValue) {
		filteredData = filteredData.filter(user => user.name.includes(searchValue))
	}

	if (ageValue) {
		filteredData = filteredData.filter(user => user.age == ageValue)
	}

	if (cityValue) {
		filteredData = filteredData.filter(user => user.city.includes(cityValue))
	}

	renderPersons(filteredData)
})

async function postData() {
	const city = document.querySelector('.city').value
	const name = document.querySelector('.name').value
	const age = document.querySelector('.age').value
	const response = await fetch('http://localhost:3000/addUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, age, city }),
	})
	if(response.ok) {
		if (response.ok) {
			renderPersons() 
		}
	}
}

add.addEventListener('click', async () => {
	await postData()

	renderPersons()
})

renderPersons()
