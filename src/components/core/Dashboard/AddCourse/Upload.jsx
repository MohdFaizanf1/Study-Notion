import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"

import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null)

  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )

  const previewFile = (file) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0]

      setSelectedFile(file)
      previewFile(file)
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    accept: video
      ? {
          "video/mp4": [".mp4"],
        }
      : {
          "image/jpeg": [".jpeg", ".jpg"],
          "image/png": [".png"],
        },

    onDrop,

    multiple: false,

    noClick: true,

    noKeyboard: true,
  })

  useEffect(() => {
    register(name, {
      required: viewData || editData ? false : true,
    })
  }, [register, name, viewData, editData])

  useEffect(() => {
    if (selectedFile) {
      setValue(name, selectedFile, {
        shouldValidate: true,
      })
    }
  }, [selectedFile, name, setValue])

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewSource("")

    setValue(name, null, {
      shouldValidate: true,
    })
  }

  return (
    <div className="flex flex-col space-y-2">

      <label
        className="text-sm text-richblack-5"
        htmlFor={name}
      >
        {label}

        {!viewData && !editData && (
          <sup className="text-pink-200">*</sup>
        )}
      </label>

      <div
        className={`${
          isDragActive
            ? "bg-richblack-600"
            : "bg-richblack-700"
        } flex min-h-[250px] items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >

        {previewSource ? (

          <div className="flex w-full flex-col p-6">

            {!video ? (

              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />

            ) : (

              <Player
                aspectRatio="16:9"
                playsInline
                src={previewSource}
              />

            )}

            {!viewData && (

              <button
                type="button"
                onClick={removeFile}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>

            )}

          </div>

        ) : (

          <div
            {...getRootProps()}
            className="flex w-full flex-col items-center p-6"
          >

            <input {...getInputProps()} />

            <button
              type="button"
              onClick={open}
              className="flex flex-col items-center"
            >

              <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">

                <FiUploadCloud className="text-2xl text-yellow-50" />

              </div>

              <p className="mt-2 max-w-[220px] text-center text-sm text-richblack-200">

                Drag and drop an{" "}
                {!video ? "image" : "video"}, or click to{" "}

                <span className="font-semibold text-yellow-50">
                  Browse
                </span>{" "}

                a file

              </p>

            </button>

            {!video && (

              <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">

                <li>Aspect ratio 16:9</li>

                <li>
                  Recommended size 1024x576
                </li>

              </ul>

            )}

          </div>

        )}

      </div>

      {errors[name] && (

        <span className="ml-2 text-xs tracking-wide text-pink-200">

          {label} is required

        </span>

      )}

    </div>
  )
}