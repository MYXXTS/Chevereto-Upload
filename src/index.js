module.exports = (ctx) => {
  const register = () => {
  }
  const commands = (ctx) => [{
    label: '',
    key: '',
    name: '',
    async handle (ctx, guiApi) {}
  }]
  return {
    commands,
    register
  }
}
