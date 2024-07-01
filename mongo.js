const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password atleast')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.2x5cd3t.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })
  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(error => {
      console.log('Error saving the  person', error)
      mongoose.connection.close()
    })
} else {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(r => {
        console.log(`${r.name} ${r.number}`)
      })
      mongoose.connection.close()
    })
    .catch(error => {
      console.log('Error saving the  person', error)
      mongoose.connection.close()
    })
}
