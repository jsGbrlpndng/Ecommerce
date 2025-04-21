import AOS from "aos" // Import AOS

// Update the fixTeamMemberImages function to better handle image loading
function fixTeamMemberImages() {
  // Get all team member image elements
  const teamImages = document.querySelectorAll(".team-member-image img")

  // Define fallback images
  const fallbackImages = {
    "john-doe.jpg": "/placeholder.svg?height=300&width=300&text=John+Doe",
    "jane-smith.jpg": "/placeholder.svg?height=300&width=300&text=Jane+Smith",
    "mike-johnson.jpg": "/placeholder.svg?height=300&width=300&text=Mike+Johnson",
    default: "/placeholder.svg?height=300&width=300&text=Team+Member",
  }

  // Check each image and apply fallback if needed
  teamImages.forEach((img) => {
    // Store original src
    const originalSrc = img.getAttribute("src")

    // Add error handler to replace with fallback if image fails to load
    img.onerror = function () {
      const filename = originalSrc.split("/").pop()
      this.src = fallbackImages[filename] || fallbackImages.default
      console.log(`Image failed to load: ${originalSrc}, using fallback`)
      this.onerror = null // Prevent infinite loop
    }

    // Check if image is already loaded
    if (img.complete) {
      if (img.naturalHeight === 0) {
        // Image failed to load
        const filename = originalSrc.split("/").pop()
        img.src = fallbackImages[filename] || fallbackImages.default
      }
    }
  })

  // Add about section image fallback
  const aboutImage = document.querySelector(".about-image-container img")
  if (aboutImage) {
    aboutImage.onerror = function () {
      this.src = "/placeholder.svg?height=500&width=800&text=About+Harmony+Haven"
      console.log(`About image failed to load, using fallback`)
      this.onerror = null
    }

    // Check if image is already loaded
    if (aboutImage.complete && aboutImage.naturalHeight === 0) {
      aboutImage.src = "/placeholder.svg?height=500&width=800&text=About+Harmony+Haven"
    }
  }
}

// Call the function when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animation library if it exists
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    })
  }

  // Check team member images
  checkTeamMemberImages()
})

function checkTeamMemberImages() {
  // Get all team member image elements
  const teamImages = document.querySelectorAll(".team-member-image img")

  // Define fallback images in case the actual images fail to load
  const fallbackImages = {
    "john-doe.jpg": "/placeholder.svg?height=300&width=300&text=John+Doe",
    "jane-smith.jpg": "/placeholder.svg?height=300&width=300&text=Jane+Smith",
    "mike-johnson.jpg": "/placeholder.svg?height=300&width=300&text=Mike+Johnson",
    default: "/placeholder.svg?height=300&width=300&text=Team+Member",
  }

  // Check each image and apply fallback if needed
  teamImages.forEach((img) => {
    // Store original src
    const originalSrc = img.getAttribute("src")

    // Add error handler to replace with fallback if image fails to load
    img.onerror = function () {
      const filename = originalSrc.split("/").pop()
      console.error(`Image failed to load: ${originalSrc}`)
      this.src = fallbackImages[filename] || fallbackImages.default
      this.onerror = null // Prevent infinite loop
    }
  })
}
