// Self-hosted fonts and build-time CSS replace the previous Google Fonts/Tailwind CDNs.
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

import './styles/tailwind.css';
import './styles/base.css';
import './styles/header-footer.css';
import './styles/hero.css';
import './styles/architecture.css';
import './styles/what-industries.css';
import './styles/cases.css';
import './styles/ai-agent.css';
import './styles/faq.css';
import './styles/logo-marquee.css';
import './styles/section-tones.css';
import './styles/tech-capabilities.css';

import './components/material.js';

// Keep the legacy initialization order during the mechanical migration.
// Interactive modules can adopt explicit init APIs in later, focused refactors.
import './components/header.js';
import './components/logo-marquee.js';
import './components/hero-carousel.js';
import './components/industries.js';
import './components/cases.js';
import './components/certificates.js';
import './components/faq.js';
import './components/lead-dialog.js';
import './components/architecture.js';
import './components/pricing.js';
import './components/business-modes.js';
import './i18n/index.js';
import './components/tech-ring.js';
import './components/tech-capabilities.js';
import './components/data-source.js';
import './components/journey.js';
import './components/hero-morph.js';
import './components/ai-agent.js';
