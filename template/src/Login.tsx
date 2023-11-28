// @ts-nocheck
import loginimg from "@assets/login.jpeg"
import std from '@assets/student.png'
import axios from 'axios'
import { SERVER_URL } from './auth'
function Login({navigate} : {navigate : any}) {
    const $ = (el) => document.getElementById(el).value

    const loginUser = async () => {
        try {
            var email = $("email")
            var password = $("password")
            if ( !email.trim() || !password.trim()){
                alert("invalid input provided")
                return;
            }
            const rawResponse = await axios.post(SERVER_URL + 'login', { email,  password})
            if (rawResponse.data["error"] != undefined){
                alert(rawResponse.data.error)
            }else {
                var data = rawResponse.data.message.user
                delete data.password
                delete data.id
                data['token'] = rawResponse.data.message.token
                localStorage.setItem('studentData', JSON.stringify(data))
                navigate(3)
            }            
        } catch (error) {
            alert(error)
        }

    }

    return <section>
        
        <div className="flex flex-row justify-start items-center">
        
            <div className="w-6/12 flex flex-col justify-start">
                <img className="pl-20" src={loginimg} alt="Login" style={{ width: "300px", height: "auto" }} />

                <div className="pt-4" style={{ paddingLeft : "4%" }}>


                    <label style={{fontSize : "20px"}} htmlFor="email">Email</label>
                    <br />
                    <div className="relative" style={{ width: "400px" }}>
                        <input id='email' name='email' className="pl-4" type="text" style={{
                            borderRadius: "3px",
                            width: "400px",
                            height: "40px",
                            outline: "none",
                            borderBottom: "3px solid #3FB5ED",
                            background: "#F1F1F1",
                            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                        }} /> <i style={{ position: "absolute", right: "2px", top: "8px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 14 15" fill="none">
                                <path d="M6.66667 0C2.98467 0 0 3.35775 0 7.5C0 11.6423 2.98467 15 6.66667 15C10.3487 15 13.3333 11.6423 13.3333 7.5C13.3333 3.35775 10.3487 0 6.66667 0ZM6.66667 13.875C5.92247 13.875 5.18556 13.71 4.49802 13.3896C3.81049 13.0691 3.18579 12.5995 2.65959 12.0074C2.13339 11.4154 1.716 10.7125 1.43125 9.93903C1.14649 9.16551 0.999956 8.33648 1 7.49925C1.00004 6.66202 1.14667 5.83301 1.4315 5.05953C1.71634 4.28605 2.1338 3.58326 2.66006 2.99129C3.18632 2.39932 3.81107 1.92975 4.49864 1.6094C5.18621 1.28906 5.92313 1.1242 6.66733 1.12425C8.17031 1.12435 9.6117 1.79613 10.6744 2.99182C11.7371 4.1875 12.3341 5.80915 12.334 7.5C12.3339 9.19086 11.7368 10.8124 10.6739 12.008C9.61111 13.2035 8.16965 13.8751 6.66667 13.875ZM6.66667 7.875C4.64133 7.875 3 9.171 3 10.5C3 11.829 4.64133 13.125 6.66667 13.125C8.692 13.125 10.3333 11.829 10.3333 10.5C10.3333 9.171 8.692 7.875 6.66667 7.875ZM6.66667 7.5C7.1971 7.5 7.70581 7.26295 8.08088 6.84099C8.45595 6.41903 8.66667 5.84674 8.66667 5.25C8.66667 4.65326 8.45595 4.08097 8.08088 3.65901C7.70581 3.23705 7.1971 3 6.66667 3C6.13623 3 5.62753 3.23705 5.25245 3.65901C4.87738 4.08097 4.66667 4.65326 4.66667 5.25C4.66667 5.84674 4.87738 6.41903 5.25245 6.84099C5.62753 7.26295 6.13623 7.5 6.66667 7.5Z" fill="black" fillOpacity="0.7" />
                            </svg></i>
                    </div>
                    <div className="p-4"></div>
                    <label style={{fontSize : "20px"}} htmlFor="password">PASSWORD</label>
                    <br />
                    <div className="relative" style={{ width: "400px" }}>
                        <input id="password" name="password" className="pl-4" type="password" style={{
                            borderRadius: "3px",
                            width: "400px",
                            height: "40px",
                            outline: "none",
                            borderBottom: "3px solid #3FB5ED",
                            background: "#F1F1F1",
                            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                        }} /> <i style={{ position: "absolute", right: "2px", top: "8px" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 15 15" fill="none">
                                <path d="M10.23 0C7.6632 0 5.58 2.0832 5.58 4.65C5.58 4.9476 5.58 5.2452 5.6358 5.5242L0 11.16V14.88H5.58V11.16H9.3V9.3L9.3558 9.2442C9.6348 9.3 9.9324 9.3 10.23 9.3C12.7968 9.3 14.88 7.2168 14.88 4.65C14.88 2.0832 12.7968 0 10.23 0ZM11.16 1.86C12.183 1.86 13.02 2.697 13.02 3.72C13.02 4.743 12.183 5.58 11.16 5.58C10.137 5.58 9.3 4.743 9.3 3.72C9.3 2.697 10.137 1.86 11.16 1.86Z" fill="black" fillOpacity="0.7" />
                            </svg></i>
                    </div>

                    <div className='w-full flex-row flex justify-start'>
                        <input onClick={loginUser} className='ml-8 mr-8 mt-8 pl-8 pr-8 pt-2 pb-2 text-white bg-sky-600 text-center rounded' title='Sign Up' name="Sign Up" type='Submit' />
                    </div>
                </div>
                <div className="pt-8 pl-8 flex">
                    <a  style={{cursor :"pointer"}} onClick={()=>navigate(1)}>Create a new account</a> <a className="pl-8" style={{cursor :"pointer"}} onClick={()=> {navigate(1)}}>Forgot Password</a> 
                </div>
                




            </div>
            <div className="w-6/10">
                <div className=" w-11/12">
                    <img  loading="lazy" srcSet={std} alt="bg"  />
                </div>
                
            </div>
        </div>
        <a onClick={()=> {
            navigate(0)
        }} style={{position : "fixed", left: "25px", top : "25px", color : "red"}}>back</a>
    </section>
}

export default Login