import { Link } from 'react-router'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { InstagramIcon, FacebookIcon, TwitterIcon, YoutubeIcon } from './SocialIcons'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Menu', to: '/menu' },
  { label: 'Reservation', to: '/reservation' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Our Chefs', to: '/chefs' },
  { label: 'Contact', to: '/contact' },
]

const hours = [
  { day: 'Monday – Friday', time: '11:00 AM – 11:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 12:00 AM' },
  { day: 'Sunday', time: '10:00 AM – 10:00 PM' },
  { day: 'Holidays', time: 'By Reservation Only' },
]

const socials = [
  { Icon: InstagramIcon, href: '#', label: 'Instagram' },
  { Icon: FacebookIcon, href: '#', label: 'Facebook' },
  { Icon: TwitterIcon, href: '#', label: 'Twitter' },
  { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center">
              <span
                style={{ fontFamily: "'Holtwood One SC', serif" }}
                className="text-[2.2rem] sm:text-[2.8rem] font-black tracking-[0.04em]"
              >
                <span className="text-[#0D5969]">Hot</span>
                <span className="text-white">&amp;Spice</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              A culinary destination where world-class chefs transform the finest ingredients into unforgettable dining experiences. Every plate is a story.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#0D5969] flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-[#2DD4BF] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#0D5969] group-hover:w-3 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Opening Hours</h3>
            <ul className="space-y-3">
              {hours.map((h) => (
                <li key={h.day} className="flex items-start gap-2 text-sm">
                  <Clock size={14} className="text-[#0D5969] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white/80 font-medium">{h.day}</p>
                    <p className="text-white/50">{h.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-[#0D5969] mt-0.5 flex-shrink-0" />
                <span className="text-white/60">Lahore, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-[#0D5969] flex-shrink-0" />
                <a href="tel:042111000111" className="text-white/60 hover:text-[#2DD4BF] transition-colors">042-111-000-111</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[#0D5969] flex-shrink-0" />
                <a href="mailto:support@hotandspice.pk" className="text-white/60 hover:text-[#2DD4BF] transition-colors">support@hotandspice.pk</a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-white/40 mb-3 uppercase tracking-widest">Newsletter</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0D5969]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#0D5969] hover:bg-[#093E4A] text-white rounded-lg text-sm transition-colors"
                >
                  <Mail size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Hot &amp; Spice. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
