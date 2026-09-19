import React from "react"
import { AiOutlineDown } from "react-icons/ai"

import CourseSubSectionAccordion from "./CourseSubSectionAccordion"

function CourseAccordionBar({
  course,
  isActive,
  handleActive,
}) {
  const active = isActive.includes(course._id)

  return (
    <div className="overflow-visible border border-solid border-richblack-600 bg-richblack-700 text-richblack-5">

      {/* Section Heading */}
      <button
        type="button"
        onClick={() => handleActive(course._id)}
        className="flex w-full items-center justify-between bg-richblack-700 px-7 py-6"
      >
        <div className="flex items-center gap-2">

          <AiOutlineDown
            className={`transition-transform duration-200 ${
              active ? "rotate-180" : ""
            }`}
          />

          <p className="font-medium">
            {course?.sectionName}
          </p>

        </div>

        <p className="text-yellow-25">
          {course?.subSection?.length || 0} lecture(s)
        </p>
      </button>

      {/* Lectures */}
      {active && (
        <div className="bg-richblack-900 px-7 py-2">
          {course?.subSection?.map((subSec) => (
            <CourseSubSectionAccordion
              key={subSec._id}
              subSec={subSec}
            />
          ))}
        </div>
      )}

    </div>
  )
}

export default CourseAccordionBar