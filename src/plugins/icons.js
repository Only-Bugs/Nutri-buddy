/**
 * @plugin icons
 * Registers FontAwesome globally for consistent icon usage
 */

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUtensils,
  faStar,
  faChartLine,
  faCheck,
  faAppleWhole,
  faBolt,
  faVial,
  faHeart,
  faDrumstickBite,
  faCarrot,
  faFish,
  faChartPie,
  faPlus,
  faBookmark,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUtensils,
  faStar,
  faChartLine,
  faCheck,
  faAppleWhole,
  faBolt,
  faVial,
  faHeart,
  faDrumstickBite,
  faCarrot,
  faFish,
  faChartPie,
  faPlus,
  faBookmark,
)

export default {
  install(app) {
    app.component('FontAwesomeIcon', FontAwesomeIcon)
  },
}
