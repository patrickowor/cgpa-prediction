export const SERVER_URL = "http://127.0.0.1:4000/"

function authenticate(){
    var val = true
    try {
         val = localStorage.getItem('studentData') != undefined &&  Object.keys(JSON.parse(localStorage.getItem('studentData')!)).length != 0
    } catch (error) {
        var val = false
    }
    return val
}
export default authenticate