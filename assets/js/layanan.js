// Layanan Page JavaScript

function hideLoading() {
  const loadingElement = document.getElementById("loading")
  if (loadingElement) {
    loadingElement.classList.add("hidden")
  }
}

async function loadJSON(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return response.json()
}

function showNotification(message, type) {
  const notificationElement = document.getElementById("notification")
  if (notificationElement) {
    notificationElement.textContent = message
    notificationElement.className = `bg-${type}-100 text-${type}-800 p-4 rounded-lg shadow-lg`
    notificationElement.classList.remove("hidden")

    setTimeout(() => {
      notificationElement.classList.add("hidden")
    }, 3000)
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadServicesContent()
    initializeServiceForm()
    hideLoading()
  } catch (error) {
    console.error("Error loading services content:", error)
    hideLoading()
  }
})

async function loadServicesContent() {
  try {
    const servicesData = await loadJSON("data/services.json")
    if (servicesData) {
      populateServicesInfo(servicesData.services)
      populateServiceTypes(servicesData.serviceTypes)
    }
  } catch (error) {
    console.error("Error loading services content:", error)
  }
}

function populateServicesInfo(services) {
  const container = document.getElementById("servicesInfo")
  if (!container || !services) return

  container.innerHTML = ""
  services.forEach((service) => {
    const serviceElement = document.createElement("div")
    serviceElement.className =
      "bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
    serviceElement.innerHTML = `
            <i class="${service.icon} text-4xl text-primary-600 dark:text-primary-400 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">${service.title}</h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">${service.description}</p>
        `
    container.appendChild(serviceElement)
  })
}

function populateServiceTypes(serviceTypes) {
  const select = document.getElementById("serviceType")
  if (!select || !serviceTypes) return

  select.innerHTML = ""
  serviceTypes.forEach((option) => {
    const optionElement = document.createElement("option")
    optionElement.value = option.value
    optionElement.textContent = option.label
    select.appendChild(optionElement)
  })
}

function initializeServiceForm() {
  const form = document.getElementById("serviceForm")
  if (!form) return

  form.addEventListener("submit", function (e) {
    e.preventDefault()

    if (validateForm(this)) {
      submitForm(this)
    }
  })

  // Real-time validation
  const inputs = form.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this)
    })

    input.addEventListener("input", function () {
      clearFieldError(this)
    })
  })
}

function validateForm(form) {
  let isValid = true
  const requiredFields = form.querySelectorAll("[required]")

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  return isValid
}

function validateField(field) {
  const value = field.value.trim()
  const fieldName = field.name
  let isValid = true
  let errorMessage = ""

  clearFieldError(field)

  if (field.hasAttribute("required") && !value) {
    errorMessage = "Field ini wajib diisi"
    isValid = false
  }

  if (value && isValid) {
    switch (fieldName) {
      case "nik":
        if (!/^\d{16}$/.test(value)) {
          errorMessage = "NIK harus terdiri dari 16 digit angka"
          isValid = false
        }
        break
      case "phone":
        if (!/^(\+62|62|0)[0-9]{9,13}$/.test(value.replace(/\s/g, ""))) {
          errorMessage = "Format nomor telepon tidak valid"
          isValid = false
        }
        break
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = "Format email tidak valid"
          isValid = false
        }
        break
      case "fullName":
        if (value.length < 3) {
          errorMessage = "Nama lengkap minimal 3 karakter"
          isValid = false
        }
        break
    }
  }

  if (!isValid) {
    showFieldError(field, errorMessage)
  }

  return isValid
}

function showFieldError(field, message) {
  const errorElement = field.parentNode.querySelector(".error-message")

  field.classList.add("border-red-500")
  field.classList.remove("border-gray-300", "dark:border-gray-600")

  if (errorElement) {
    errorElement.textContent = message
    errorElement.classList.remove("hidden")
  }
}

function clearFieldError(field) {
  const errorElement = field.parentNode.querySelector(".error-message")

  field.classList.remove("border-red-500")
  field.classList.add("border-gray-300", "dark:border-gray-600")

  if (errorElement) {
    errorElement.textContent = ""
    errorElement.classList.add("hidden")
  }
}

function submitForm(form) {
  const submitButton = form.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML

  submitButton.disabled = true
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...'

  setTimeout(() => {
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    console.log("Form submitted:", data)
    showNotification("Permohonan berhasil dikirim! Kami akan menghubungi Anda segera.", "success")

    form.reset()
    submitButton.disabled = false
    submitButton.innerHTML = originalText
  }, 2000)
}
