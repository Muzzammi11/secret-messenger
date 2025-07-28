import React from 'react'

function Footer() {
  return (
    <>
   <footer className="app-footer">
    <div className="footer-content">
    <p className="footer-text">
    &copy; {new Date().getFullYear()} Anonymous Messenger |  Made in  Kashmir  🍁
    </p>
    {/* <p className="footer-tagline">
    Stop stalking 👀... you could&rsquo;ve just sent a message, y'know?
    </p> */}
    </div>
    </footer>
    </>
  )
}

export default Footer