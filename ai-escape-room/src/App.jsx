import { useEffect, useState } from "react"

function App() {
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(error => console.log(error))
  });

  return (
    <>
      <div>
        { msg ? msg : 'Failed To Fetch' }
      </div>
    </>
  )
}

export default App
