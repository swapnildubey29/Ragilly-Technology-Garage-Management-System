const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    location: String,
    vehicle_type: String,
    image: {
        data: Buffer,
        contentType: String
    },
    description: String,
    vehicle_brand: String,
    vehicle_model: String,
    fuel_type: String,
    car_year: Number,
    service_type: String,
    service_place_type: String,
    address: String,
    service_date: Date,
    service_time: String,
    quotation: String,
    price: Number,
    discount: Number,
    payable_price: Number,
    status: String,
});

orderSchema.virtual('formattedServiceDate').get(function() {
    return this.service_date ? this.service_date.toISOString().split('T')[0] : '';
});

module.exports = mongoose.model('Order', orderSchema);