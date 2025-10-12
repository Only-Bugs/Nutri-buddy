/**
 * @plugin icons
 * Registers FontAwesome once, globally
 *
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUtensils, faStar, faChartLine, faCheck } from '@fortawesome/free-solid-svg-icons'

library.add(faUtensils, faStar, faChartLine, faCheck)

export default {
  install(app) {
    app.component('FontAwesomeIcon', FontAwesomeIcon)
  },
}
