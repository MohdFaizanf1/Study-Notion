const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      })
    }

    const categoryDetails = await Category.create({
      name,
      description,
    })

    console.log("Category Created:", categoryDetails)

    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
      data: categoryDetails,
    })
  } catch (error) {
    console.error("Create Category Error:", error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get All Categories
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find()

    return res.status(200).json({
      success: true,
      data: allCategories,
    })
  } catch (error) {
    console.error("Show Categories Error:", error)

    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Category Page Details
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      })
    }

    // Selected Category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: {
          status: "Published",
        },
        populate: {
          path: "ratingAndReviews",
        },
      })
      .exec()

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    console.log(
      "Selected Category:",
      selectedCategory.name
    )

    console.log(
      "Published Courses:",
      selectedCategory.courses.length
    )

    // Find Other Categories
    const categoriesExceptSelected = await Category.find({
      _id: {
        $ne: categoryId,
      },
    })

    let differentCategory = null

    // Only select another category if one exists
    if (categoriesExceptSelected.length > 0) {
      const randomIndex = getRandomInt(
        categoriesExceptSelected.length
      )

      const randomCategory =
        categoriesExceptSelected[randomIndex]

      differentCategory = await Category.findById(
        randomCategory._id
      )
        .populate({
          path: "courses",
          match: {
            status: "Published",
          },
        })
        .exec()
    }

    // Get All Published Courses
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: {
          status: "Published",
        },
      })
      .exec()

    const allCourses = allCategories.flatMap(
      (category) => category.courses || []
    )

    // Sort using sold if it exists
    const mostSellingCourses = allCourses
      .sort(
        (a, b) =>
          (b.sold || 0) - (a.sold || 0)
      )
      .slice(0, 10)

    return res.status(200).json({
      success: true,

      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    console.error(
      "Category Page Details Error:",
      error
    )

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}