/**
 * @composable useChartConfig
 * Centralize Chart.js registration and common configs
 *
 */
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'

let _registered = false
export function useChartConfig() {
  if (!_registered) {
    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)
    _registered = true
  }
  const defaultOptions = { responsive: true, maintainAspectRatio: false }
  return { defaultOptions }
}
