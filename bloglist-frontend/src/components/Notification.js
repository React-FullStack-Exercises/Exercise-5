const Notification = ({ notification, removeNotification }) => {
  const { message, type } = notification
  if (message === null || message === '') {
    return null
  }
  if (type === "error") {
    return (
      <div className="error">
        {message}
      </div>
    )
  } else if(type === "success") {
    return (
      <div className="success">
        {message}
      </div>
    )
  }
  removeNotification()
}

export default Notification