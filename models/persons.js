const mongoose = require('mongoose')

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(console.log('connected to db'))
  .catch(error => console.error(error.message))
const personScehema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 10,
    validate: {
      validator: function (n) {
        return /^\d{2,3}-\d{7,8}$/.test(n)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true,
  },
})

personScehema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personScehema)