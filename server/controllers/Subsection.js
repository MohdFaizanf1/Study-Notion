const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// ============================================================
// CREATE SUBSECTION
// ============================================================

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body

    const video = req.files?.video

    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      })
    }

    console.log("Uploading video:", video.name)

    // Upload video to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_VIDEO || "videos"
    )

    console.log("Cloudinary Video URL:", uploadDetails.secure_url)

    if (!uploadDetails.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Video upload failed",
      })
    }

    // Create SubSection
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration: `${uploadDetails.duration || 0}`,
      description,
      videoUrl: uploadDetails.secure_url,
    })

    // Add SubSection to Section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSection: subSectionDetails._id,
        },
      },
      {
        new: true,
      }
    ).populate("subSection")

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Lecture created successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error("CREATE SUBSECTION ERROR:", error)

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// ============================================================
// UPDATE SUBSECTION
// ============================================================

exports.updateSubSection = async (req, res) => {
  try {
    const {
      sectionId,
      subSectionId,
      title,
      description,
    } = req.body

    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID is required",
      })
    }

    const subSection = await SubSection.findById(
      subSectionId
    )

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    // Update title
    if (title !== undefined) {
      subSection.title = title
    }

    // Update description
    if (description !== undefined) {
      subSection.description = description
    }

    // If a new video is uploaded
    if (req.files?.video) {
      const video = req.files.video

      console.log("Updating video:", video.name)

      const uploadDetails =
        await uploadImageToCloudinary(
          video,
          process.env.FOLDER_VIDEO || "videos"
        )

      console.log(
        "Updated Cloudinary URL:",
        uploadDetails.secure_url
      )

      subSection.videoUrl =
        uploadDetails.secure_url

      subSection.timeDuration =
        `${uploadDetails.duration || 0}`
    }

    await subSection.save()

    const updatedSection =
      await Section.findById(sectionId).populate(
        "subSection"
      )

    return res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(
      "UPDATE SUBSECTION ERROR:",
      error
    )

    return res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the SubSection",
      error: error.message,
    })
  }
}

// ============================================================
// DELETE SUBSECTION
// ============================================================

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body

    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message:
          "SubSection ID and Section ID are required",
      })
    }

    await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )

    const subSection =
      await SubSection.findByIdAndDelete(
        subSectionId
      )

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    const updatedSection =
      await Section.findById(sectionId).populate(
        "subSection"
      )

    return res.status(200).json({
      success: true,
      message:
        "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(
      "DELETE SUBSECTION ERROR:",
      error
    )

    return res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting the SubSection",
      error: error.message,
    })
  }
}