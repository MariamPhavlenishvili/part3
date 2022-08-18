require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token("data", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : " ";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  const date = new Date().toUTCString();
  const info = `Phonebook has info for ${Person.length} people`

  response.send(`<p>${info}</p> 
                    <p>${date}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // const person = persons.find(person => person.id === id)

  // if (person) {
  //   response.json(person)
  // } else {
  //   response.status(404).end('user not found')
  // }
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  // if (!body.name || !body.number) {
  //   return response.status(400).json({
  //     error: 'name or number is missing'
  //   })
  // }

  // if (persons.find(person => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

  response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

