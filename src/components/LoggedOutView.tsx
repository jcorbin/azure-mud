import React from 'react'
import { sendMagicEmail } from '../networking'

export default function LoggedOutView () {
  const [email, setEmail] = React.useState('')

  const sendEmail = () => {
    sendMagicEmail(email)
    console.log("Email sent to", email)
    // TODO: Show a message that the email was sent 
  }

  return (
    <div>
      <header role="banner">
        <h1>Welcome to Roguelike Celebration 2024!</h1>
      </header>
      <main role="main">
        <p>
          This is a social space for attendees of{' '}
          <a href='https://roguelike.club'>Roguelike Celebration</a>, a
          community-generated weekend of talks, games, and conversations about
          roguelikes and related topics, including procedural generation and
          game design. It&apos;s for fans, players, developers, scholars, and
          everyone else!
        </p>
        <p>After you enter your email address, we will email you a 'magic' link that will allow you to login, no password needed!</p>
        <div className="email">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            {/* TODO: wire up enter key */}
            <button onClick={sendEmail}>Send Login Link</button>
          </div>        
          <p>
          <strong>We now only support logging in via email.</strong><br/>We&apos;re sorry if you used
          a third-party login in previous years. If you sign in using the same email you used for Google, you should still be able to log in as your previous account.
        </p>
        <p>
          If it's your first time here, after logging in, you will have the opportunity to pick whatever chat handle you would
          like before entering the space.
        </p>
        <p>
          By entering the space, you agree to our{' '}
          <a href={'https://roguelike.club/code.html'}>Code of Conduct</a>.
        </p>
      </main>
    </div>
  )
}
