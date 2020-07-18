
export function install(Vue, args = {}) {
    if (install.installed) return
    install.installed = true
  
    const components = args.components || {}
  
    for (const key in components) {
      Vue.component(key, components[key])
    }
  }
  