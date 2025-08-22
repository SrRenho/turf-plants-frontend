import { FaGithub, FaLinkedin } from 'react-icons/fa';
import footer from './Footer.css';

export default function Footer() {
  return (
    <footer style={{ textAlign: "right", padding: "1rem", marginTop: "auto" }}>
      Created by Juan José García Vizioli               
      <a href="https://github.com/SrRenho" target="_blank"><FaGithub style={{ marginRight: "1rem", marginLeft: "1rem" }}/></a> 
      <a href="https://linkedin.com/in/juan-josé-garcía-vizioli-802001218/" target="_blank"><FaLinkedin style={{ marginRight: "1rem" }}/></a>
    </footer>
  );
}