const { mongoose } = require('./index');
const User = require('./user')
const Productschema = new mongoose.Schema({
     name: {
        type: String,
        unique: true,
        min: 3,
        max: 30,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    price: {
        type: Number,
        min: 0,
        max: 10000,
        required: true
    },
    color: [{
        type: String,
        required: true
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    payload: {
        releasedAt: {
            type: Date,
            required: true
        },
        expiredAt: {
            type: Date,
           required: true
        }, 
    }

})

const Product = mongoose.model('Product', Productschema)

module.exports = Product;