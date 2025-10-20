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
  faMagnifyingGlass,
  faArrowLeft,
  faArrowRight,
  // 👇 add these new ones
  faUser,
  faChevronDown,
  faGear,
  faArrowRightFromBracket,
  faGauge,
  faHouse,
  faClipboardList,
  faClockRotateLeft,
  faBookOpen,
  faQuoteLeft,
  faShieldHalved,
  faLeaf,
  faLock,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

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
  faMagnifyingGlass,
  faArrowLeft,
  faArrowRight,
  faUser,
  faChevronDown,
  faGear,
  faArrowRightFromBracket,
  faGauge,
  faHouse,
  faClipboardList,
  faClockRotateLeft,
  faBookOpen,
  faQuoteLeft,
  faShieldHalved,
  faLeaf,
  faLock,
  faEnvelope,
  faLinkedin,
  faGithub,
)

export default {
  install(app) {
    app.component('FontAwesomeIcon', FontAwesomeIcon)
  },
}
