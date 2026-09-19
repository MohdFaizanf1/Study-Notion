import React, { useState } from "react"
import { HiOutlineVideoCamera } from "react-icons/hi"
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai"

function CourseSubSectionAccordion({ subSec }) {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className="w-full border-b border-richblack-600">

      <button
        type="button"
        onClick={() => setShowVideo((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between px-10 py-6 text-left"
      >
        <div className="flex items-center gap-3">
          <HiOutlineVideoCamera className="text-xl text-richblack-5" />

          <p className="font-medium text-richblack-5">
            {subSec?.title}
          </p>
        </div>

        {showVideo ? <AiOutlineUp /> : <AiOutlineDown />}
      </button>

      {showVideo && subSec?.videoUrl && (
        <div className="px-10 pb-6">

          <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-video">
            <video
              key={subSec.videoUrl}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-contain"
            >
              <source
                src={subSec.videoUrl}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>

          {subSec?.description && (
            <p className="mt-3 text-sm text-richblack-200">
              {subSec.description}
            </p>
          )}

        </div>
      )}

    </div>
  )
}

export default CourseSubSectionAccordion