/** @jsx OwnReact */
const element = () => {
  return (
    <div id="container">
      <input value="foo" type="text" />
      <a href="/bar">
        bar
      </a>
      <span onClick={(e) => alert('Hi')}>
      click me
    </span>
      <p>{new Date().toLocaleTimeString()}</p>
    </div>
  )
}

export default element
