console.log("test")



const updateStyle = (content) => {
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.textContent = content
  document.head.append(style)
}
export { updateStyle }
