export default function ContactForm() {
    return (
      <form name="contact" method="POST" data-netlify="true">
        <input type="hidden" name="form-name" value="contact" />
        <p>
          <label>Votre nom : <input type="text" name="name" /></label>
        </p>
        <p>
          <label>Votre email : <input type="email" name="email" /></label>
        </p>
        <p>
          <label>Message : <textarea name="message"></textarea></label>
        </p>
        <p>
          <button type="submit">Envoyer</button>
        </p>
      </form>
    )
  }