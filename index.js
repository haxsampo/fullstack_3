const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

morgan.token('type', function (req, res) { 
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        id: '1',
        name: 'Pentti',
        number: '666613098',
       
    },
    {   
        id: '2',
        name: 'Paavo Väyrynen',
        number: '08758713098',
           
    },
    {   
        id: '3',
        name: 'jaska jokunen',
        number: '9876543212',
         
    }
]


app.get('/', (req, res) =>{
    res.send('<h1>Hello world</h1>')
})

app.get('/info', (req, res) => {
    const pituus = persons.length
    const aika = new Date()
    res.json('amount of contacts: '+pituus+'   ' +aika)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const requestedId = Number(req.params.id)
    let person = {};
    let i;
    for(i = 0; i < persons.length; i++ ) {
        if(Number(persons[i].id) === requestedId) {
            person = Object.assign(person, persons[i])
        }
    }
    console.log(person)
    if(person.id) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const requestedId = Number(req.params.id)
    console.log(typeof persons[0].id)
    console.log('reqid: ', requestedId)
    persons = persons.filter(person => Number(person.id) !== requestedId)

    res.status(204).end()
})

//lisää ressiin että palauttaa saman väkkärän niin frontin listat pysyy kondiksessa
app.post('/api/persons', (req, res) => {
    const newPerson = req.body
    const newId =  Math.floor(Math.random() * (99999 - 1)) + 1
    newPerson.id = newId

    if(!newPerson.name) {
        res.status(418).send({ error: 'name not included' })
    } 
    if(!newPerson.number) {
        res.status(400).send({ error: 'number not included' })
    }
    const isNameIncluded = persons.find(person => newPerson.name === person.name)
    if(isNameIncluded) {
        res.status(400).send({ error: 'name already exists' })
    }

    persons = [...persons, newPerson]
    res.status(200).json(newPerson)
    res.status(200).end()
})


const port = process.env.PORT  || 3001
app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})
