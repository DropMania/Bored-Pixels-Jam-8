export default async (endpoint, data = {}) => {
    let API_URL = 'https://theyaretheheros-dropmania.vercel.app'
    //let API_URL = 'http://192.168.2.116:5000'
    let response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}
