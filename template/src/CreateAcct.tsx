// @ts-nocheck
import std from '@assets/student.png'
import axios from 'axios'
import { SERVER_URL } from './auth'
const CreateAccount = ({navigate } :{navigate : any}) => {
    
    const register = async () => {
        try {
            const $ = (el) => document.getElementById(el).value
            var lastname = $("lastname")
            var firstname = $("firstname")
            var email = $("email")
            var username = $("username")
            var password = $("password")
            var confirm = $("confirm")
            if (!lastname.trim() || !firstname.trim() || !email.trim() || !username.trim() || !password.trim() || !confirm.trim() ){
                alert("invalid input provided")
                return;
            }
            if (confirm !== password){
                alert("password is not correct")
                return;
            }
            const rawResponse = await axios.post(SERVER_URL + 'signup', {lastname, firstname, email, username, password})
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


    return  <section className='flex gap-5 pt-4'>
    <div className='w-8/12'>
        <h3 className="text-4xl max-w-[281px] ml-1.5 pl-14 inline" >Create Account</h3>
        <div className='flex w-full flex-col '>
            <div className='p-8 pb-2 justify-around w-full flex-row flex text-xl'>
                <div className='w-4/12' >
                    <label htmlFor="firstName" >first name</label><br />
                    <input id="firstname" className='w-full pl-2 text-lg outline-none border-2 border-black rounded' name='firstname' type="text" />                    
                </div>
                <div className='w-4/12'>
                    <label htmlFor="firstName" >last name</label><br />
                    <input id='lastname' className='w-full pl-2 text-lg outline-none border-2 border-black rounded' name='lastname' type="text" />                    
                </div>
            </div>

            <div className='p-8 pt-2 pb-2 justify-around w-full flex-row flex text-xl'>
                <div className='w-4/12' >
                    <label htmlFor="Email" >Email</label><br />
                    <input className='w-full pl-2 text-lg outline-none border-2 border-black rounded' id='email' name='Email' type="text" />                    
                </div>
                <div className='w-4/12'>
                    <label htmlFor="UserName" >User Name</label><br />
                    <input className='w-full pl-2 text-lg outline-none border-2 border-black rounded' id='username' name='UserName' type="text" />                    
                </div>
            </div>

            <div className='p-8 pt-2 pb-2 justify-around w-full flex-row flex text-xl'>
                <div className='w-4/12' >
                    <label htmlFor="password" >Password</label><br />
                    <input className='w-full pl-2 text-lg outline-none border-2 border-black rounded' id="password" name='password' type="text" required={true} />                    
                </div>
                <div className='w-4/12'>
                    <label htmlFor="confirm Password" >Confirm Password</label><br />
                    <input className='w-full pl-2 text-lg outline-none border-2 border-black rounded' id="confirm" name='confirm Password' type="text" required={true} />                    
                </div>
            </div>
            
            <div className='w-full flex-row flex justify-end'>
                <input  className='ml-32 mr-8 mt-8 pl-8 pr-8 pt-2 pb-2 text-white bg-sky-600 text-center rounded' title='Sign Up' name="Sign Up" type='Submit' onClick={register} />
            </div>
            <a className='p-28 pt-2 pb-2  text-sm' onClick={()=>navigate(2)}>Login existing users</a>
            
        </div>
    </div>
    <div className='w-4/12'>
        <img loading="lazy" srcSet={std} alt="bg"   />
    </div>
    <a onClick={()=> {
            navigate(0)
        }} style={{position : "fixed", left: "25px", top : "25px", color : "red"}}>back</a>
  </section>
}


export default CreateAccount;