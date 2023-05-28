
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')




describe('user creation ',()=>{

    test('invalid users are not created', ()=>{



    })





})