
const fetch = require('node-fetch')
const { Wrapper } = require('../')

const URL = 'https://www.instagram.com'

module.exports = class Instagram extends Wrapper {
 constructor () {
  super('instagram')  
}
  
 getUser(userName) {
        return this.request(userName)
    }

 getStories(userName) {
        return this.request(`stories/${userName}`)
    }
    
 request(endPoint) {
        return fetch(`${URL}/${endPoint}/?__a=1`)
            .then(res => res.json())
    } 
 }
