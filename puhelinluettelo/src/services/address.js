import axios from 'axios'

const baseURL = 'http://localhost:3001/api/persons'

const getAll = () => {
    const request =  axios.get(baseURL)
    return request.then(response => response.data)
}

const create = newObject => {
     const request = axios.post(baseURL, newObject)
     return request.then(response => response.data)
}

const delNum = delNum => {
    console.log(baseURL+'/'+delNum)
    const request = axios.delete(baseURL+'/'+delNum )
    return request.then(response => response.data)
}



export default {
    getAll: getAll,
    create: create,
    delNum: delNum
}