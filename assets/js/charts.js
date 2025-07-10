import { Chart } from "@/components/ui/chart"
// Charts JavaScript

let charts = {}

// Declare getThemeColor function
function getThemeColor(colorKey) {
  // Dummy implementation for demonstration purposes
  const themeColors = {
    text: "#000000",
    textSecondary: "#666666",
    background: "#FFFFFF",
    border: "#CCCCCC",
  }
  return themeColors[colorKey]
}

// Declare debounce function
function debounce(func, wait) {
  let timeout
  return function (...args) {
    
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Initialize Chart
function initializeChart(chartKey, canvas, config) {
  const ctx = canvas.getContext("2d")

  // Parse callback functions from JSON strings
  const processedConfig = JSON.parse(JSON.stringify(config))

  // Handle tooltip callbacks
  if (processedConfig.options?.plugins?.tooltip?.callbacks) {
    const callbacks = processedConfig.options.plugins.tooltip.callbacks
    Object.keys(callbacks).forEach((key) => {
      if (typeof callbacks[key] === "string") {
        callbacks[key] = new Function(
          "context",
          callbacks[key].replace("function(context) { return ", "return ").replace("; }", ""),
        )
      }
    })
  }

  // Handle scale callbacks
  if (processedConfig.options?.scales?.y?.ticks?.callback) {
    const callback = processedConfig.options.scales.y.ticks.callback
    if (typeof callback === "string") {
      processedConfig.options.scales.y.ticks.callback = new Function(
        "value",
        callback.replace("function(value) { return ", "return ").replace("; }", ""),
      )
    }
  }

  // Set theme-appropriate colors
  updateChartThemeColors(processedConfig)

  charts[chartKey] = new Chart(ctx, {
    type: processedConfig.type,
    data: processedConfig.data,
    options: {
      ...processedConfig.options,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...processedConfig.options?.plugins,
        legend: {
          ...processedConfig.options?.plugins?.legend,
          labels: {
            ...processedConfig.options?.plugins?.legend?.labels,
            color: getThemeColor("text"),
            font: {
              family: "Poppins",
            },
          },
        },
      },
      scales: processedConfig.options?.scales
        ? {
            ...processedConfig.options.scales,
            y: processedConfig.options.scales.y
              ? {
                  ...processedConfig.options.scales.y,
                  ticks: {
                    ...processedConfig.options.scales.y.ticks,
                    color: getThemeColor("textSecondary"),
                    font: {
                      family: "Poppins",
                    },
                  },
                  grid: {
                    color: getThemeColor("border"),
                  },
                }
              : undefined,
            x: processedConfig.options.scales.x
              ? {
                  ...processedConfig.options.scales.x,
                  ticks: {
                    ...processedConfig.options.scales.x.ticks,
                    color: getThemeColor("textSecondary"),
                    font: {
                      family: "Poppins",
                    },
                  },
                  grid: {
                    color: getThemeColor("border"),
                  },
                }
              : undefined,
          }
        : undefined,
    },
  })
}

// Update chart theme colors
function updateChartThemeColors(config) {
  // Update border colors for doughnut and pie charts
  if (config.data?.datasets) {
    config.data.datasets.forEach((dataset) => {
      if (dataset.borderColor === undefined && (config.type === "doughnut" || config.type === "pie")) {
        dataset.borderColor = getThemeColor("background")
      }
    })
  }
}

// Update charts theme when dark mode is toggled
function updateChartsTheme() {
  Object.values(charts).forEach((chart) => {
    if (chart) {
      // Update legend colors
      if (chart.options.plugins?.legend?.labels) {
        chart.options.plugins.legend.labels.color = getThemeColor("text")
      }

      // Update scales colors
      if (chart.options.scales) {
        ;["x", "y"].forEach((axis) => {
          if (chart.options.scales[axis]) {
            if (chart.options.scales[axis].ticks) {
              chart.options.scales[axis].ticks.color = getThemeColor("textSecondary")
            }
            if (chart.options.scales[axis].grid) {
              chart.options.scales[axis].grid.color = getThemeColor("border")
            }
          }
        })
      }

      chart.update()
    }
  })
}

// Destroy all charts
function destroyCharts() {
  Object.values(charts).forEach((chart) => {
    if (chart) chart.destroy()
  })
  charts = {}
}

// Handle window resize
window.addEventListener(
  "resize",
  debounce(() => {
    Object.values(charts).forEach((chart) => {
      if (chart) chart.resize()
    })
  }, 250),
)
