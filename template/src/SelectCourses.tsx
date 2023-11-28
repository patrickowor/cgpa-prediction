// @ts-nocheck

import axios from 'axios'
import { SERVER_URL } from './auth'
import { useEffect, useState } from 'react'
const SelectCourses = ({navigate, setcourses} : {navigate : any, setcourses: any}) => {
    let semail = JSON.parse(localStorage.getItem('studentData')).email;
    let student_data = {};
    let [courseList, setCourseList] = useState([])
    let [selectedList, setSelectedList] = useState([])
    let [selectedIndexList, setSelectedIndexList] = useState([])

    const predict = async () => {
        try {
            student_data['selectedList'] = selectedList
            student_data['selectedIndexList'] = selectedIndexList
            localStorage.setItem(semail, JSON.stringify(student_data))
        } catch (error) {
            
        }
        if (selectedList.length == 0){
            alert("courses cannot be left empty")
        } else {
            setcourses(selectedList)
            navigate(6)
        }

    }




    useEffect(()=>  {

        if (courseList.length === 0){
            (async (setCourseList) => {
                try {
                    var studentdata = JSON.parse(localStorage.getItem('studentData')!)
                    var res = await axios.get(SERVER_URL + `getprogram/${studentdata['program']}`)  
                    if (res.data["error"] != undefined){
                        alert(res.data.error)
                    } else {
                        setCourseList(res.data.message)

                        let student_data = JSON.parse(localStorage.getItem(semail));
                        if (student_data != null && student_data['selectedList'] != undefined && student_data['selectedIndexList'] !=undefined)  {
                            setSelectedList(student_data['selectedList'])
                            setSelectedIndexList(student_data['selectedIndexList'])
                        }
                
                    }       
                } catch (error) {
                    alert(error)
                }
            })(setCourseList)
        }
    }, [])


    const deleteData = (index) => {
        setSelectedList(selectedList.filter((value, i) => index != i ))
        setSelectedIndexList(selectedIndexList.filter((_, i) => i !== selectedIndexList.indexOf(index)))
    }

    const updatedata = () => {
        var grade = document.getElementById("coursegrade").options[document.getElementById("coursegrade").selectedIndex].value;
        var course_i = document.getElementById("courseinfo").options[document.getElementById("courseinfo").selectedIndex].value;
        if (!selectedIndexList.includes(parseInt(course_i))) {
            setSelectedIndexList([ ...selectedIndexList, parseInt(course_i) ])
            let dt = courseList[parseInt(course_i)].Courses;
            var course_data = { "course_name"  : dt.title, "course_id" : dt.id, "grade" : grade , "index" : course_i };
            setSelectedList([...selectedList, course_data]);         
        } else {
            alert("course already exist in list")
        }

        
        // navigate(4)
    }
    var data = JSON.parse(localStorage.getItem("studentData")!)
    return <section className="w-full ">
        {/* <h2 className="text-3xl max-w-[281px] ml-1.5 pl-24 mt-12 " style={{paddingTop : "0px"}} >welcome</h2>
        <h3 className="text-2xl max-w-[281px] ml-1.5 pl-40 inline " style={{paddingTop : "0px"}} >"{ data['firstname']}, {data['lastname']}"</h3> */}
        <div style={{marginInline : "20%", backgroundColor : "white" , borderRadius : "10px", marginTop : "10px", height : "340px", padding : "10px", overflowY : "scroll"}}>
            
            <div className='flex flex-row pb-1 mb-2' style={{borderBottom : "1px solid grey"}}>
                        <div className='w-8/12'>selected courses</div> <div className='w-2/12'>grade</div> <div className='w-2/12' style={{color : "white"}}> d</div>
                    </div>
            {
                selectedList.map(( el, i)=>{
                    
                    let dt = courseList[el.index].Courses;
                    

                    return <div key={`courseinfo-${i}`} 
                    className='flex flex-row'>
                        <div className='w-8/12'>{`${dt.code} ${dt.title}     ${dt.unit}  ${dt.status} `}</div> <div className='w-2/12 pl-4'>{el.grade.toUpperCase()}</div> <div className='w-2/12 text-center' style={{color : "red"}} onClick={()=> deleteData(i)}> delete</div>
                    </div>
                })
            }

        </div>

        <div className="w-8/12 flex flex-row justify-center mt-12 items-center pb-4" style={{position : "fixed",marginInline : "16.6%", bottom :"80px", zIndex : "100", backgroundColor : "#e5e7eb"}}>
            <div className="w-5/12 flex flex-col ">
                <div className="w-full text-l ">Select Course</div>
                <select className="w-full p-4 pt-1 pb-1 rounded" name="courseinfo" id="courseinfo" >
                    { courseList.map((el, i) => {
                        let dt = el.Courses;
                        return <option key={`courseinfo-${i}`} value={`${i}`}>{`${dt.code} ${dt.title}     ${dt.unit}  ${dt.status}`}</option>
                    })}
                    
                </select>                
            </div>
            <div className="w-2/12 ml-4">
            <div className="w-full text-l ">Select Grade</div>
                <select className="w-full p-4 pt-1 pb-1 rounded" name="coursegrade" id="coursegrade">
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                    <option value="e">E</option>
                    <option value="f">F</option>
                </select>                
            </div>

            <div>
                <input onClick={updatedata} className='ml-2  mt-6 pl-8 pr-8 pt-1  pb-1 text-white bg-sky-600 text-center rounded' type='Submit' defaultValue="ADD" />
            </div>
        </div>


        <button style={{position : "fixed", right: "49%", bottom : "25px", color : "white", backgroundColor : "blueviolet"}}  onClick={()=>predict()}>
            Submit
        </button>
        <a onClick={()=> {
            localStorage.removeItem('studentData')
            navigate(100)
        }} style={{position : "fixed", right: "25px", bottom : "25px", color : "red"}}>logout</a>
        <a onClick={()=> {
            navigate(4)
        }} style={{position : "fixed", left: "25px", top : "25px", color : "red"}}>back</a>
    </section>
}

export default SelectCourses;