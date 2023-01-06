import OwnReact from "../OwnReact"
import Story from "./Story"
/** @jsxRuntime classic */
/** @jsx OwnReact.createElement */

const stories = [
  { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "Components and state", url: "http://bit.ly/2rE16nh" },
]

export const element = () => {
  return (
    <div>
      <h1>Didact Stories</h1>
      <ul>
        {stories.map((story) => {
          // @ts-ignore
          // eslint-disable-next-line react/jsx-key
          return <Story name={story.name} url={story.url} />
        })}
      </ul>
    </div>
  )
}
