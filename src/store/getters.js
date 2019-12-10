const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  resources: state => state.user.resources,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
export default getters
