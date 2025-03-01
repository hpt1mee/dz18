const person = document.querySelector('.persons')
const search = document.querySelector('.search')
const find = document.querySelector('.find')
const add = document.querySelector('.add')

async function deleteUser(userId) {
	const response = await fetch(`http://localhost:3000/deleteUser/${userId}`, {
		method: 'DELETE',
	})
	if (response.ok) {
		renderPersons()
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
async function renderPersons() {
	const data = await getDataFunction('http://localhost:3000/getUsers')
	data.USERS.forEach(user => {
		person.insertAdjacentHTML(
			`beforeend`,
			`<div class="person" data-id=${user.id}>
					${user.name} ${user.age} ${user.city}
					<button class="delete" onclick="deleteUser('${user.id}')"></button>
				</div>`
		)
	})
}
renderPersons()

find.addEventListener('click', async () => {
	person.innerHTML = ''
	const value = search.value.trim()
	const data = await getDataFunction(
		`http://localhost:3000/search?query=${value}`
	)
	data.forEach(user => {
		person.insertAdjacentHTML(
			`beforeend`,
			`<div class="person" data-id=${user.id}>
					${user.name} ${user.age} ${user.city}
					<button class="delete" onclick="deleteUser('${user.id}')"></button>
				</div>`
		)
	})
})

async function postData(id) {
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
}
add.addEventListener('click', async () => {
	await postData()
	person.innerHTML = ''
	await renderPersons()
})
