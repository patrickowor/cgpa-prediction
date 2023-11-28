import logo from '@assets/logo.svg'
import bg from '@assets/bg.png'
import Welcome from './Welcome'
import CreateAccount from './CreateAcct'
import SelectLevel from './SelectLevel'
import SelectDegree from './SelectDegree'
import SelectCourses from './SelectCourses'
import Predict from './Predict'
import { useState } from 'react'
import authenticate from './auth'
// var authenticate = () => true


import Login from './Login'






function App() {
  let [current , navigate] = useState(0)
  let [level , setlevel] = useState("")
  let [degree , setdegree] = useState("")
  let [courses , setcourses] = useState([])
  var display = <></>

  switch (current) {
    case 6 :
      display = !authenticate() ?  <Login navigate={navigate} /> : <Predict navigate={navigate} level={level} degree={degree} courses={courses} />; break;
    case 5:
      display = !authenticate() ? <Login navigate={navigate} /> :  <SelectCourses navigate={navigate} setcourses={setcourses} /> ; break ;   
    case 4 :
      display = !authenticate() ? <Login navigate={navigate} /> :  <SelectDegree navigate={navigate} setdegree={setdegree} /> ; break ; 
    case 3 :
      display = !authenticate() ? <Login navigate={navigate}/> :  <SelectLevel navigate={navigate} setLevel={setlevel}/> ; break ; 
    case 2 : // login
      display = !authenticate() ? <Login navigate={navigate}/>:<SelectLevel navigate={navigate} setLevel={setlevel}/> ; break ; 
    case 1:// create account
      display = !authenticate() ? <CreateAccount navigate={navigate}/>  : <SelectLevel navigate={navigate} setLevel={setlevel} /> ; break; 
    case 0 : // welcome
    default :
      display = <Welcome navigate={navigate} />; break;
  }

  return (
    <section  style={{backgroundImage : `url(${bg})`, height : "100vh", 	backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover", border : "20px solid rgba(1, 32, 197, 0.25)" }}>
      <div style={{ margin : "10px 0px 0px 30px"}}  className="relative flex w-[466px] max-w-full items-start gap-4 max-md:flex-wrap" >
        <img loading="lazy" srcSet={logo} alt="bg" style={{ width : "130px",  height :"110px"}}  />
        <div className="flex flex-col grow shrink-0 basis-auto mt-3">
            <h1 className="text-blue-800 text-center text-5xl self-stretch">DEPARTMENT OF COMPUTER ENGINEERING</h1>
            <h2 className="text-blue-800 text-center text-5xl self-center mt-1.5">IBOGUN CAMPUS</h2>
          </div>
      </div>
      {display}  
    </section>
  )
}

export default App


