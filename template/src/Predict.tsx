// @ts-nocheck
import axios from 'axios'
import { SERVER_URL } from './auth'
import { useEffect, useState } from 'react'
const Predict = ({navigate, level, degree, courses} : {navigate : any, level: any, degree : any, courses : any })=>{
    let [minimum, setMinimum] = useState("")
    let [courseList, setcourseList] = useState([])
    let [respData, setRespData] = useState({})


    var toMin = (v) => {
        var s;
        if (v <= 5.00 && v >= 4.50){
            s = 4.50
        } else if (v <= 4.49 && v >= 3.50){
            s =3.50
        } else if (v <= 3.49 && v >= 2.50){
            s =2.50
        } else if (v <= 2.49 && v >= 1.50){
            s =1.50
        } else if (v <= 1.49 && v >= 1){
            s =1
        } else {
            return "pass"
        }
        return  s
    }
    var getScore = (minimum,degree) => {
        if (minimum.trim() === "") {
            var cgpa_max_score = {"1" : 5.00, "21" : 4.49 , "22" : 3.49, "3" : 2.49, "pass" : 1.49}
             var score = parseInt(cgpa_max_score[degree])
        } else {
            var score = parseInt(minimum)
        }  
        var grade = {5: 'a' , 4 : 'b', 3 : 'c', 2 : 'd', 1 :  "e", 0 : "f"}
        // console.log(score, grade[score])
        return grade[score]
    }


    var predict = async () => {
        try {
            var body = {coursesandgrade : courses, level , degree, minimum : minimum.trim() === "" ?  null : parseInt(minimum)  }
            // console.log(body)
            var data = JSON.parse(localStorage.getItem("studentData")!)
            const rawResponse = await axios.post(SERVER_URL + 'predict', body, {
                headers : {
                    Authorization : "Bearer " + data['token']
                }
            })
            if (rawResponse.data["error"] != undefined){
                alert(rawResponse.data.error)
            }else {    
                setcourseList(rawResponse.data.courses)
                setRespData( {cgpa : parseFloat(rawResponse.data.cgpa).toFixed(2) , attainable : rawResponse.data.attainable , degree : getScore(minimum,degree).toUpperCase(),
                minGpa:  toMin(rawResponse.data.cgpa)   
                })
            } 
        } catch (error) {
            alert(error)
        }
    }

    useEffect(()=> {
        predict()
    }, [])
    

    return (<section>
        <div className="w-4/12 flex flex-row justify-center">
            <div className="w-6/12 mr-1">
                <div className=" text-sm ">Minimum grade for Each course</div>
                <select onChange={()=> {
                    setMinimum(document.getElementById("coursegrade").options[document.getElementById("coursegrade").selectedIndex].value)

                }} className="w-full p-4 pt-1 pb-1 rounded" name="coursegrade" id="coursegrade">
                    <option value="">---</option>
                    <option value="5">A</option>
                    <option value="4">B</option>
                    <option value="3">C</option>
                    <option value="2">D</option>
                    <option value="1">E</option>
                    <option value="0">F</option>
                </select>    
            </div>
            <div>
                <div className=" text-l " style={{opacity : 0}}>Select Grade</div>
                <button onClick={()=> predict()} style={{backgroundColor : "blueviolet", height : "30px" , paddingTop : "0px"}}>submit</button>
            </div>
            
        </div>
        
        <div style={{padding : "5px",backgroundColor : "white", width : "90%", height : "400px", marginInline : "5%", marginTop : "10px", boxShadow : "0px 5px 5px 0px rgba(0,0,0,0.2)", display : "flex", flexWrap : "wrap", overflowY : "scroll"}}>
            {Object.keys(respData).length === 0 ? <></> :
            <div style={{ padding : "5px", fontSize : "15px", fontWeight : "bold", backgroundColor : respData.attainable ? 'green' : 'red', color : 'white', width : "100%", margin : "5px"  }}>
                <div>{respData.attainable ? `You Can attain a Cgpa of "${respData.cgpa}" by taking the suggested courses below` : `You cannot attain your desired gpa the predicted gpa attainable is "${respData.cgpa}"  `} {`by scoring a minimum of "${respData.degree}" per course`}, {`and a minimum gpa of ${respData.minGpa} per semester. `}</div>
            </div>
            }
            {Object.keys(courseList).reverse().map((name, index, parent)=> {
                return <div key={`level-div-${index}`} style={{minWidth : "49%", maxWidth : "50%",  margin : "2px"}}>
                    <div style={{backgroundColor : "blueviolet",  width : "100%", color : "white", fontSize : "15px", fontWeight : "bolder"}}>{name}</div>
                    {
                        courseList[name].map((el, i) => <div key={`coursename-${index}-${i}`} style={{color : "black"}}>
                             {`${el.code} ${el.title} ${el.unit} ${el.status} (${el.code.trim() === 'CPE 599' ?  'Rain' :  parseInt(el.code.split(' ')[1]) % 2 == 0 ? 'Rain': 'Harmattan' })`}
                        </div> )
                    }
                </div>
            })}
        </div>
        <a onClick={()=> {
            localStorage.removeItem('studentData')
            navigate(100)
        }} style={{position : "fixed", right: "25px", bottom : "25px", color : "red"}}>logout</a>
        <a onClick={()=> {
            navigate(5)
        }} style={{position : "fixed", left: "25px", top : "25px", color : "red"}}>back</a>
    </section>)
}

export default Predict