import { withPluginApi } from 'discourse/lib/plugin-api'

const sentryBrowserVersion = '5.15.5'

export default {
  name: 'discourse-sentry',

  initialize() {
    withPluginApi('0.8.24', () => {
      const src = `https://browser.sentry-cdn.com/${sentryBrowserVersion}/bundle.min.js`
      const enabled = Discourse.SiteSettings.discourse_sentry_enabled
      const dsn = Discourse.SiteSettings.discourse_sentry_dsn

      if (!enabled || !dsn) {
        return
      }

      const script = document.createElement('script')

      script.onload = () => {
        window.Sentry.init({
          dsn,
        })

        const currentUser = Discourse.User.current()

        if (currentUser) {
          const { id, username } = currentUser

          window.Sentry.configureScope((scope) => {
            scope.setUser({ id, username })
          })
        }
      }

      script.src = src
      document.head.appendChild(script)
    })
  },
}
