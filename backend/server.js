import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'

const PORT = 3000
const app = express()

const getPath = filename =>
	path.join(process.cwd(), '../', 'frontend', 'html', `${filename}.html`)

app.use(express.static(path.join(process.cwd(), '../', 'frontend')))
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
	res.sendFile(getPath(`index`))
})

app.post('/addUser', (req, res) => {
	const filePath = path.join(process.cwd(), 'db', 'db.json')
	const users = JSON.parse(fs.readFileSync(filePath, 'utf-8')) 
	const newUser = req.body
	newUser.id = Date.now().toString() 
	users.USERS.push(newUser) 
	fs.writeFileSync(filePath, JSON.stringify(users)) 

})

app.get('/getUsers', (req, res) => {
	const users = fs.readFileSync(
		path.join(process.cwd(), 'db', 'db.json'),
		'utf-8'
	)
	res.json(JSON.parse(users))
})

app.get('/search', (req, res) => {
	const users = JSON.parse(
		fs.readFileSync(path.join(process.cwd(), 'db', 'db.json'), 'utf-8')
	)
	console.log(users)
	const query = req.query.query.toLowerCase()
	const result = users.USERS.filter(user =>
		user.name.toLowerCase().includes(query)
	)
	res.json(result)
})



app.delete('/deleteUser/:id', (req, res) => {
	const filePath = path.join(process.cwd(), 'db', 'db.json')
	const users = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
	const userId = req.params.id
	users.USERS = users.USERS.filter(user => user.id != userId)
	fs.writeFileSync(filePath, JSON.stringify(users))
})

app.listen(PORT, () => {
	console.log(`server is listening port: ${PORT}`)
})
