import std from './assets/student.png'

const Welcome = ({ navigate } : {navigate : any }) => {
    return       <section className='flex gap-5 pt-4'>
    <div className='w-6/12'>
      <h3 className="text-blue-800 text-6xl max-w-[281px] ml-1.5 pl-14" style={{fontFamily:"Jacques Francois Shadow"}}>WELCOME</h3>
      <p className='pl-48 pt-4'>Let help you through your academic success...</p>
      <p className='pl-14 text-xl pt-8'>A dream becomes a goal when action is taken  <br/>toward its achievement.</p>
      <p className='pl-14 text-xl pt-16'>With HARDWORK, CONSISTENCY and DISCIPLINE <br/>it is possible. </p>
      <input  className='ml-32 mr-8 mt-8 pl-8 pr-8 pt-2 pb-2 text-white bg-sky-600 text-center rounded' title='GET STARTED' name="GET STARTED" type='submit' onClick={() => navigate(1)} value={"GET STARTED"} />
    </div>
    <div className='w-6/12'>
    <img loading="lazy" srcSet={std} alt="bg"   />
    </div>
  </section>
}

export default Welcome