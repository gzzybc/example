import OwnReact from './OwnReact'
/** @jsxRuntime classic */
/** @jsx OwnReact.createElement */
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

// @jsxRuntime @jsx  配置参考文档
// https://stackoverflow.com/questions/66965774/emotion-css-prop-and-nextjs-new-jsx-runtime-error-pragma-and-pragmafrag-canno
