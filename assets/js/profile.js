// Profile Page JavaScript

function hideLoading() {
  const loadingElement = document.getElementById("loading")
  if (loadingElement) {
    loadingElement.style.display = "none"
  }
}

async function loadJSON(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load JSON from ${url}`)
  }
  return response.json()
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadProfileContent()
    hideLoading()
  } catch (error) {
    console.error("Error loading profile content:", error)
    hideLoading()
  }
})

async function loadProfileContent() {
  try {
    const profileData = await loadJSON("data/profile.json")
    if (profileData && profileData.profile) {
      populateProfile(profileData.profile)
    }
  } catch (error) {
    console.error("Error loading profile content:", error)
  }
}

function populateProfile(profile) {
  const container = document.getElementById("profileContent")
  if (!container) return

  let content = ""

  // History section
  if (profile.history) {
    content += `
            <div class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg mb-8 animate-fade-in-up">
                <h3 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-6 flex items-center">
                    <i class="${profile.history.icon} mr-3"></i>
                    ${profile.history.title}
                </h3>
                ${profile.history.content.map((paragraph) => `<p class="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">${paragraph}</p>`).join("")}
            </div>
        `
  }

  // Vision and Mission
  if (profile.vision && profile.mission) {
    content += `
            <div class="grid md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg animate-fade-in-up">
                    <h3 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-6 flex items-center">
                        <i class="${profile.vision.icon} mr-3"></i>
                        ${profile.vision.title}
                    </h3>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed italic text-lg">"${profile.vision.content}"</p>
                </div>
                <div class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg animate-fade-in-up">
                    <h3 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-6 flex items-center">
                        <i class="${profile.mission.icon} mr-3"></i>
                        ${profile.mission.title}
                    </h3>
                    <ul class="space-y-3">
                        ${profile.mission.content
                          .map(
                            (item) => `
                            <li class="text-gray-700 dark:text-gray-300 flex items-start">
                                <i class="fas fa-check text-primary-600 dark:text-primary-400 mr-3 mt-1 flex-shrink-0"></i>
                                <span>${item}</span>
                            </li>
                        `,
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        `
  }

  // Map section
  if (profile.map) {
    content += `
            <div class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg mb-8 animate-fade-in-up">
                <h3 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-6 flex items-center">
                    <i class="${profile.map.icon} mr-3"></i>
                    ${profile.map.title}
                </h3>
                <div class="grid lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-2">
                        <img src="${profile.map.image}" alt="Peta Desa" class="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    </div>
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Keterangan:</h4>
                        <div class="space-y-3">
                            ${profile.map.legend
                              .map(
                                (item) => `
                                <div class="flex items-center space-x-3">
                                    <div class="w-5 h-5 rounded border border-gray-300 dark:border-gray-600" style="background-color: ${item.color}"></div>
                                    <span class="text-gray-700 dark:text-gray-300">${item.label}</span>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                </div>
            </div>
        `
  }

  // Leadership section
  if (profile.leadership) {
    content += `
            <div class="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg animate-fade-in-up">
                <h3 class="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-6 flex items-center">
                    <i class="${profile.leadership.icon} mr-3"></i>
                    ${profile.leadership.title}
                </h3>
                <div class="grid sm:grid-cols-2 gap-6">
                    ${profile.leadership.positions
                      .map(
                        (position) => `
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                            <h4 class="font-semibold text-gray-900 dark:text-white">${position.title}</h4>
                            <p class="text-primary-600 dark:text-primary-400 font-medium">${position.name}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Periode: ${position.period}</p>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `
  }

  container.innerHTML = content
}
