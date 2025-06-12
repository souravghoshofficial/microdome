import {useParams} from "react-router"

const SemesterCourseLayout = () => {
 const {id} = useParams()
  return (
    <div className="w-full h-screen flex items-center justify-center">{id}</div>
  )
}

export default SemesterCourseLayout