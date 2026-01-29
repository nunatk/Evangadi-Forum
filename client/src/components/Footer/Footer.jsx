import logo from "../../assets/images/Evangadi-footer-logo.png";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <img src={logo} alt="Evangadi" className="footer-logo" />
        </div>

        <div>
          <h4>Useful Link</h4>
          <p>How it works</p>
          <p>Terms of Service</p>
          <p>Privacy policy</p>
        </div>

        <div>
          <h4>Contact Info</h4>
          <p>Evangadi Networks</p>
          <p>support@evangadi.com</p>
          <p>+1-202-386-2702</p>
        </div>
      </div>
    </footer>
  );
}
