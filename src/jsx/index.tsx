import OwnReact from "../OwnReact"
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
        {stories.map((story, index) => {
          // @ts-ignore
          // eslint-disable-next-line react/jsx-key
          return (
            <li key={index}>
              <button
                onClick={(e) => {
                  console.log(e)
                }}
              >
                <b>❤️</b>
              </button>
              <a href={story.url}>{story.name}</a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
