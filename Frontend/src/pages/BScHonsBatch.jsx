import {useState , useEffect} from 'react'
import axios from 'axios'
import { CourseCard } from '../components'

const ApiUrl = import.meta.env.VITE_BACKEND_URL;

const BScHonsBatch = () => {
  // const courses = [
  //   {
  //     id: 1,
  //     courseTitle: "Semester - I",
  //     subTitle: "Ultimate guide to excel in the Microbiology",
  //     courseTag: "B.Sc Hons.",
  //     type: "live",
  //     language: "hinglish",
  //     courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
  //     actualPrice: 1200,
  //     discountedPrice: 999,
  //     linkAddress: "semester-1"
  //   },
  //   {
  //     id: 2,
  //     courseTitle: "Semester - II",
  //     subTitle: "Ultimate guide to excel in the Microbiology",
  //     courseTag: "B.Sc Hons.",
  //     type: "live",
  //     language: "hinglish",
  //     courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
  //     actualPrice: 1200,
  //     discountedPrice: 999,
  //     linkAddress: "semester-2"
  //   },
  //   {
  //     id: 3,
  //     courseTitle: "Semester - III",
  //     subTitle: "Ultimate guide to excel in the Microbiology",
  //     courseTag: "B.Sc Hons.",
  //     type: "live",
  //     language: "hinglish",
  //     courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
  //     actualPrice: 1200,
  //     discountedPrice: 999,
  //     linkAddress: "semester-3"
  //   },
  //   {
  //     id: 4,
  //     courseTitle: "Semester - IV",
  //     subTitle: "Ultimate guide to excel in the Microbiology",
  //     courseTag: "B.Sc Hons.",
  //     type: "live",
  //     language: "hinglish",
  //     courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
  //     actualPrice: 1200,
  //     discountedPrice: 999,
  //     linkAddress: "semester-4"
  //   },
  //   {
  //     id: 5,
  //     courseTitle: "Semester - V",
  //     subTitle: "Ultimate guide to excel in the Microbiology",
  //     courseTag: "B.Sc Hons.",
  //     type: "live",
  //     language: "hinglish",
  //     courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
  //     actualPrice: 1500,
  //     discountedPrice: 1200,
  //     linkAddress: "semester-5"
  //   },
  //   {
  //     id: 6,
  //     courseTitle: "Semester - VI",
  //     subTitle: "Ultimate guide to excel in the Microbiology",
  //     courseTag: "B.Sc Hons.",
  //     type: "live",
  //     language: "hinglish",
  //     courseImg: "https://i.pinimg.com/736x/83/64/94/836494e86b6a554fa71fb47e858cf32c.jpg",
  //     actualPrice: 1500,
  //     discountedPrice: 1200,
  //     linkAddress: "semester-6"
  //   },
  // ]
  const [Loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    axios.get(`${ApiUrl}/api/v1/courses/get-all-courses`)
    .then((res) => {
      console.log(res.data);
      setCourses(res.data.courses)
    })
    .catch((err) => console.log(err))
     .finally(() => {setLoading(false)})
  }, [])

  const semesterCourses = courses.filter(course => course.courseTag.toLowerCase() === "b.sc hons")

   if(Loading) return (
  <div className='w-full h-screen '>
    Loading...
  </div>
  )

  return (
    <div className='w-full flex items-center justify-center transition-colors duration-300'>
        <div className='my-24 md:my-32 w-[90%]'>
            <h2 className='text-3xl md:text-4xl font-bold text-center'>Semester Batches</h2>
            <div className='mt-8 w-full lg:w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16'>
              {semesterCourses.map((course) => <CourseCard key={course.id} imageHeight='h-60' courseTitle={course.title} subTitle={course.subTitle} type={course.mode.toUpperCase()} language={course.language.toUpperCase()}  courseImg={course.courseImage} courseTag={course.courseTag.toUpperCase()} actualPrice={course.actualPrice} discountedPrice={course.discountedPrice} linkAddress={course.linkAddress}/>)}
            </div>
        </div>
    </div>
  )
}

export default BScHonsBatch