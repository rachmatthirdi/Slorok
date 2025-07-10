// Home Page JavaScript

const siteData = {}
const newsData = {}

// Declare variables before using them
function hideLoading() {
  const loadingElement = document.getElementById("loading")
  if (loadingElement) loadingElement.style.display = "none"
}

async function loadJSON(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to load ${url}`)
  return response.json()
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(date).toLocaleDateString(undefined, options)
}

// Initialize Home Page
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadHomeContent()
    hideLoading()
  } catch (error) {
    console.error("Error loading home content:", error)
    hideLoading()
  }
})

async function loadHomeContent() {
  try {
    // Load data
    const [configData, newsData] = await Promise.all([loadJSON("data/config.json"), loadJSON("data/news.json")])

    if (configData) {
      populateInfoCards(configData.infoCards)
    }

    if (newsData) {
      populateNews(newsData.news)
    }
  } catch (error) {
    console.error("Error loading home content:", error)
  }
}

function populateInfoCards(infoCards) {
  const container = document.getElementById("infoCards")
  if (!container || !infoCards) return

  container.innerHTML = ""
  infoCards.forEach((card) => {
    const cardElement = document.createElement("div")
    cardElement.className =
      "bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
    cardElement.innerHTML = `
            <i class="${card.icon} text-4xl text-primary-600 dark:text-primary-400 mb-4"></i>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${card.number}</h3>
            <p class="text-gray-600 dark:text-gray-300 font-medium">${card.label}</p>
        `
    container.appendChild(cardElement)
  })
}

function populateNews(news) {
  const container = document.getElementById("newsGrid")
  if (!container || !news) return

  container.innerHTML = ""
  const newsToShow = news.slice(0, 3)

  newsToShow.forEach((item) => {
    const newsElement = document.createElement("article")
    newsElement.className =
      "bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"

    newsElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-gray-500 dark:text-gray-400 font-medium">${formatDate(item.date)}</span>
                    <span class="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded text-xs font-medium">${item.category}</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">${item.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">${item.excerpt}</p>
                <a href="berita.html" class="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 transition-colors duration-200 flex items-center space-x-1">
                    <span>Baca Selengkapnya</span>
                    <i class="fas fa-arrow-right text-sm"></i>
                </a>
            </div>
        `
    container.appendChild(newsElement)
  })
}

// Get Default Site Data
function getDefaultSiteData() {
  return {
    site: { title: "Desa Sejahtera" },
    hero: {
      title: "Selamat Datang di Desa Sejahtera",
      subtitle: "Desa yang maju, mandiri, dan sejahtera",
    },
    infoCards: [
      { icon: "fas fa-users", number: "2,500", label: "Jumlah Penduduk" },
      { icon: "fas fa-home", number: "650", label: "Kepala Keluarga" },
      { icon: "fas fa-map", number: "15.5", label: "Luas Wilayah (km²)" },
      { icon: "fas fa-seedling", number: "8", label: "Dusun" },
    ],
    contact: {
      address: "Jl. Desa Sejahtera No. 123",
      phone: "(021) 1234-5678",
      email: "info@desasejahtera.id",
      workingHours: {
        weekdays: "Senin - Jumat: 08:00 - 16:00",
        saturday: "Sabtu: 08:00 - 12:00",
        sunday: "Minggu: Tutup",
      },
      socialMedia: [
        { platform: "facebook", icon: "fab fa-facebook", url: "#" },
        { platform: "instagram", icon: "fab fa-instagram", url: "#" },
        { platform: "twitter", icon: "fab fa-twitter", url: "#" },
        { platform: "youtube", icon: "fab fa-youtube", url: "#" },
      ],
    },
  }
}

// Populate Home Content
function populateHomeContent() {
  populateHeroSection()
  populateFooter()

  // Update site title
  if (siteData.site?.title) {
    document.title = siteData.site.title + " - Beranda"
    const brandText = document.getElementById("brandText")
    if (brandText) brandText.textContent = siteData.site.title
  }
}

// Populate Hero Section
function populateHeroSection() {
  const heroTitle = document.getElementById("heroTitle")
  const heroSubtitle = document.getElementById("heroSubtitle")

  if (heroTitle && siteData.hero?.title) {
    heroTitle.textContent = siteData.hero.title
  }

  if (heroSubtitle && siteData.hero?.subtitle) {
    heroSubtitle.textContent = siteData.hero.subtitle
  }
}

// Populate Footer
function populateFooter() {
  const footerContent = document.getElementById("footerContent")
  if (!footerContent || !siteData.contact) return

  const contact = siteData.contact

  footerContent.innerHTML = `
        <div>
            <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">Kontak Kami</h3>
            <div class="space-y-3 text-gray-600 dark:text-gray-300">
                <p class="flex items-start space-x-3">
                    <i class="fas fa-map-marker-alt text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0"></i>
                    <span>${contact.address}</span>
                </p>
                <p class="flex items-center space-x-3">
                    <i class="fas fa-phone text-primary-600 dark:text-primary-400 flex-shrink-0"></i>
                    <span>${contact.phone}</span>
                </p>
                <p class="flex items-center space-x-3">
                    <i class="fas fa-envelope text-primary-600 dark:text-primary-400 flex-shrink-0"></i>
                    <span>${contact.email}</span>
                </p>
            </div>
        </div>
        
        <div>
            <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">Jam Pelayanan</h3>
            <div class="space-y-2 text-gray-600 dark:text-gray-300">
                <p>${contact.workingHours.weekdays}</p>
                <p>${contact.workingHours.saturday}</p>
                <p>${contact.workingHours.sunday}</p>
            </div>
        </div>
        
        <div>
            <h3 class="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-4">Media Sosial</h3>
            <div class="flex space-x-4">
                ${contact.socialMedia
                  .map(
                    (social) => `
                    <a href="${social.url}" class="w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1">
                        <i class="${social.icon}"></i>
                    </a>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `
}
