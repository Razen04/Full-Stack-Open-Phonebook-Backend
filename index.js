const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

// app.use(morgan('tiny'))

app.use(express.json())
app.use(cors())

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

morgan.token('post-data', (request) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
})

app.use(morgan(function (tokens, request, response) {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms',
        tokens['post-data'](request)
    ].join(' ')
}))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find((person) => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

const now = new Date()

app.get('/info', (request, response) => {
    const htmlContent =
        `<p>
        Phonebook has ${persons.length} info
        <br/>
        ${now}
    </p>`
    response.send(htmlContent)
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter((p) => p.id !== id)
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 1000)
    const newPerson = { id: id.toString(), ...request.body }
    if (!newPerson.name || !newPerson.number) {
        response.status(400).send('name must be unique')
    } else if (persons.find((p) => p.name === newPerson.name)) {
        response.status(400).send('name must be unique')
    } else {
        persons.push(newPerson)
        response.json(newPerson)
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})