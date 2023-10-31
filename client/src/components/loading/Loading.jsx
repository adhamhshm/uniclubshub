import "./loading.scss";

const Loading = () => {
  return (
    <div className="loading">
        <div className="loading-text">
            <h2>Please don't refresh</h2>
        </div>
        <div className="loader"></div>
    </div>
  )
}

export default Loading;