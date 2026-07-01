import ContactView from '../../components/ContactView.jsx';

export const metadata = {
  title: 'Contact Us',
  description:
    'Send us your plans and get a fixed construction estimate quote within hours. Call (800) 555-1200 or fill out the form — response within one business day.',
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return <ContactView />;
}
