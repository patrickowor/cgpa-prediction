// @ts-nocheck
const SelectLevel = ({navigate, setLevel} : {navigate : any, setLevel : any}) => {
    const updatelevel = () => {
        setLevel(document.getElementById("level").options[document.getElementById("level").selectedIndex].value)
        navigate(4)
    }
    var data = JSON.parse(localStorage.getItem("studentData")!)
    return <section className="w-full ">
        <h2 className="text-3xl max-w-[281px] ml-1.5 pl-24 mt-12 " style={{paddingTop : "10px"}} >Welcome</h2>
        <h3 className="text-2xl max-w-[281px] ml-1.5 pl-48 inline " style={{paddingTop : "10px"}} >"{ data['firstname']}, {data['lastname']} ({data['username']})"</h3>
        <div className="w-full flex flex-col justify-center mt-12 items-center">
            <div className="w-4/12 text-l ">Input your current Semester and Level</div><br />
            <select className="w-4/12 p-4 pt-1 pb-1 rounded" name="level" id="level">
                <option value="100 - harmattan">Harmattan 100 level</option>
                <option value="100 - rain">Rain 100 level</option>
                <option value="200 - harmattan">Harmattan 200 level</option>
                <option value="200 - rain">Rain 200 level</option>                
                <option value="300 - harmattan">Harmattan 300 level</option>
                <option value="300 - rain">Rain 300 level</option>
                <option value="400 - harmattan">Harmattan 400 level</option>
                <option value="400 - rain">Rain 400 level</option>
                <option value="500 - harmattan">Harmattan 500 level</option>
                <option value="500 - rain">Rain 500 level</option>
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
            navigate(0)
        }} style={{position : "fixed", left: "25px", top : "25px", color : "red"}}>back</a>
    </section>
}

export default SelectLevel;