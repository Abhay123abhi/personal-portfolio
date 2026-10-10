import { ArrowUpRight } from "lucide-react";
import { identity } from "../../data/portfolioData";

export default function ContactFooter() {
  return (
    <footer className="contact compact-contact" id="contact">
      <p>Let’s connect.</p>
      <a className="contact-email" href={`mailto:${identity.email}`}>
        Email me <ArrowUpRight size={18} />
      </a>
    </footer>
  );
}
