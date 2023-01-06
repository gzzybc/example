import * as Didact from "../Didact"
import OwnReact from "../OwnReact"
/** @jsxRuntime classic */
/** @jsx OwnReact.createElement */
export default class Story extends Didact.Component {
  constructor(props) {
    super(props)
    this.state = { likes: Math.ceil(Math.random() * 100) }
  }

  like() {
    this.setState({
      likes: this.state.likes + 1,
    })
  }

  render() {
    const { name, url } = this.props
    const { likes } = this.state
    return (
      <li>
        <button onClick={(e) => this.like()}>
          {likes}
          <b>❤️</b>
        </button>
        <a href={url}>{name}</a>
      </li>
    )
  }
}
