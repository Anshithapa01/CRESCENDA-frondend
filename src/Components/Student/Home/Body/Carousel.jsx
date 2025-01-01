import React from 'react'
import AliceCarousel from 'react-alice-carousel'
import CourseCard from '../../../OtherComponents/Card/CourseCard'

const Carousel = ({courses}) => {
    const responsive={
        0:{items:1},
        720:{items:3},
        1024:{items:5.5}
    }
    const items=[1,1,1,1,1].map((item)=><CourseCard course={courses}/>)
  return (
    <div>
      <AliceCarousel
        items={items}
        responsive={responsive}
        autoPlay    
      />
    </div>
  )
}

export default Carousel
