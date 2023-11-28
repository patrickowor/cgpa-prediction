// @ts-nocheck
const SelectDegree = ({navigate, setdegree} : {navigate : any, setdegree : any}) => {
    const updatelevel = () => {
        setdegree(document.getElementById("degree").options[document.getElementById("degree").selectedIndex].value)
        navigate(5)
    }
    var data = JSON.parse(localStorage.getItem("studentData")!)
    return <section className="w-full ">
        <h2 className="text-3xl max-w-[281px] ml-1.5 pl-24 mt-12 " style={{paddingTop : "10px"}} >Welcome</h2>
        <h3 className="text-2xl max-w-[281px] ml-1.5 pl-40 inline " style={{paddingTop : "10px"}} >"{ data['firstname']}, {data['lastname']} ({data['username']})"</h3>
        <div className="w-full flex flex-col justify-center mt-12 items-center">
            <div className="w-4/12 text-xl ">Select  Class of Degree</div><br />
            <select className="w-4/12 p-4 pt-1 pb-1 rounded" name="degree" id="degree">
                <option value="1">1st Class (5.00 - 4.50) </option>
                <option value="21">2nd Class Upper (4.49 - 3.50)</option>
                <option value="22">2nd Class lower (3.49 - 2.50)</option>
            </select>
            <div className='w-5/12 flex-row flex justify-end'>
                <input onClick={updatelevel} className='ml-32 mr-8 mt-4 pl-8 pr-8 pt-1 pb-1 text-white bg-sky-600 text-center rounded' type='Submit' />
            </div>
        </div>
        <a onClick={()=> {
            localStorage.removeItem('studentData')
            navigate(100)
        }} style={{position : "fixed", right: "25px", bottom : "25px", color : "red"}}>logout</a>
        <a onClick={()=> {
            navigate(3)
        }} style={{position : "fixed", left: "25px", top : "25px", color : "red"}}>back</a>
    </section>
}

export default SelectDegree