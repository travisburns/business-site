export interface SeoPage {
  slug: string
  title: string
  description: string
  h1: string
  service: string
  city: string
  county: string
  heroSubtitle: string
  intro: string
  features: string[]
  content: string
  faq: { question: string; answer: string }[]
  nearbyAreas: string[]
  estimatorType: string | null
}

// All 5 services
const SERVICES = {
  'tile-installation': {
    service: 'Tile Installation',
    estimatorType: 'tile',
    features: [
      'Kitchen backsplashes',
      'Bathroom floor and shower tile',
      'Floor tile installation',
      'Custom tile patterns and mosaics',
      'Natural stone, porcelain, and ceramic',
      'Grout repair and re-tiling',
    ],
  },
  'kitchen-remodeling': {
    service: 'Kitchen Remodeling',
    estimatorType: 'kitchen',
    features: [
      'Custom cabinet installation',
      'Countertop installation (granite, quartz, butcher block)',
      'Tile backsplashes',
      'Complete kitchen renovations',
      'Flooring and lighting upgrades',
      'Kitchen island construction',
    ],
  },
  'bathroom-renovation': {
    service: 'Bathroom Renovation',
    estimatorType: 'bathroom',
    features: [
      'Shower and tub installation',
      'Tile work and waterproofing',
      'Vanity and countertop installation',
      'Complete bathroom remodels',
      'Accessibility upgrades (ADA compliant)',
      'Plumbing fixture upgrades',
    ],
  },
  'deck-fencing': {
    service: 'Decks & Fencing',
    estimatorType: 'deck',
    features: [
      'Custom deck design and construction',
      'Cedar and composite decking',
      'Privacy and picket fence installation',
      'Vinyl and wood fencing options',
      'Deck repairs and refinishing',
      'Railings, stairs, and gates',
    ],
  },
  'patio-cover': {
    service: 'Patio Covers',
    estimatorType: 'patio',
    features: [
      'Custom patio cover design',
      'Wood and aluminum structures',
      'Attached and freestanding covers',
      'Weather protection solutions',
      'Outdoor lighting integration',
      'Pergolas and shade structures',
    ],
  },
}

// All 4 cities + Springfield
const CITIES: Record<string, { city: string; county: string; nearbyAreas: string[] }> = {
  eugene: {
    city: 'Eugene',
    county: 'Lane County',
    nearbyAreas: ['Springfield', 'Cottage Grove', 'Veneta', 'Coburg', 'Junction City'],
  },
  springfield: {
    city: 'Springfield',
    county: 'Lane County',
    nearbyAreas: ['Eugene', 'Cottage Grove', 'Coburg', 'Thurston', 'Glenwood'],
  },
  'cottage-grove': {
    city: 'Cottage Grove',
    county: 'Lane County',
    nearbyAreas: ['Eugene', 'Creswell', 'Drain', 'Lorane', 'Springfield'],
  },
  veneta: {
    city: 'Veneta',
    county: 'Lane County',
    nearbyAreas: ['Eugene', 'Elmira', 'Noti', 'Junction City', 'Crow'],
  },
  coburg: {
    city: 'Coburg',
    county: 'Lane County',
    nearbyAreas: ['Eugene', 'Springfield', 'Junction City', 'Harrisburg', 'Santa Clara'],
  },
}

// Content templates per service (unique per service, city name inserted dynamically)
function generateContent(serviceKey: string, cityKey: string): Pick<SeoPage, 'heroSubtitle' | 'intro' | 'content' | 'faq'> {
  const city = CITIES[cityKey].city

  const contentMap: Record<string, Pick<SeoPage, 'heroSubtitle' | 'intro' | 'content' | 'faq'>> = {
    'tile-installation': {
      heroSubtitle: `Expert tile work for kitchens, bathrooms, floors, and more in ${city}`,
      intro: `Halleman Construction provides professional tile installation services throughout ${city} and the surrounding Lane County area. Whether you need a simple kitchen backsplash or a complete bathroom tile overhaul, our skilled team delivers precision craftsmanship with materials built to last in Oregon's climate.`,
      content: `We specialize in ceramic, porcelain, natural stone, and glass tile installation for residential projects in ${city}. Every tile job starts with proper surface preparation — the foundation that most contractors cut corners on. We ensure your substrate is level, clean, and properly waterproofed before a single tile is set.\n\nOur ${city} tile installation services include custom shower surrounds with waterproof membrane systems, kitchen backsplashes that transform the look of your space, and durable floor tile that handles Oregon's wet seasons. We work with homeowners to select the right tile material for each application — porcelain for high-traffic floors, natural stone for elegant bathrooms, and decorative glass for accent walls.\n\nAs a licensed contractor serving ${city} and Lane County, we stand behind every installation with quality workmanship and materials sourced from trusted suppliers in the Pacific Northwest.`,
      faq: [
        { question: `How much does tile installation cost in ${city}?`, answer: `Tile installation in ${city} typically ranges from $10-$25 per square foot depending on the tile material, pattern complexity, and surface preparation needed. We provide free estimates for all projects.` },
        { question: `How long does a tile installation project take?`, answer: `Most residential tile projects in ${city} take 2-5 days depending on the scope. A kitchen backsplash may take 1-2 days, while a full bathroom tile job typically takes 3-5 days.` },
        { question: `Do you handle tile removal and disposal?`, answer: `Yes, we handle complete tear-out of existing tile, surface preparation, and disposal of old materials as part of our tile installation service in ${city}.` },
      ],
    },
    'kitchen-remodeling': {
      heroSubtitle: `Complete kitchen renovations tailored to your style and budget in ${city}`,
      intro: `Halleman Construction delivers professional kitchen remodeling services to homeowners in ${city} and throughout Lane County. From minor kitchen updates to full-scale renovations, our team handles every detail — cabinets, countertops, tile, flooring, and lighting — so you get a kitchen that works for your family.`,
      content: `A kitchen remodel is one of the best investments you can make in your ${city} home. We work with you to design a layout that maximizes your space, storage, and workflow. Whether you want modern minimalist or classic farmhouse, we build it to last.\n\nOur ${city} kitchen remodeling services cover everything from custom cabinet installation and countertop fabrication to tile backsplashes and flooring upgrades. We coordinate all trades — plumbing, electrical, and finish work — so you have one point of contact throughout the project.\n\nWe source materials from local Lane County suppliers whenever possible, keeping costs down and supporting the community. Every kitchen renovation includes a detailed scope of work, transparent pricing, and a realistic timeline so there are no surprises.`,
      faq: [
        { question: `How much does a kitchen remodel cost in ${city}?`, answer: `Kitchen remodels in ${city} typically range from $15,000-$45,000 depending on the scope. A basic update with new countertops and backsplash starts around $15K, while a full renovation with custom cabinets runs $30K-$45K.` },
        { question: `How long does a kitchen remodel take in ${city}?`, answer: `Most kitchen remodels in ${city} take 4-8 weeks from demolition to completion. We provide a detailed timeline before starting and keep you updated throughout the project.` },
        { question: `Can I use my kitchen during the remodel?`, answer: `We set up a temporary kitchen area so you can still prepare basic meals. We also work to minimize disruption by completing the project in phases when possible.` },
      ],
    },
    'bathroom-renovation': {
      heroSubtitle: `Professional bathroom remodeling and renovation in ${city}`,
      intro: `Halleman Construction provides expert bathroom renovation services in ${city} and the surrounding Lane County communities. Whether you need a simple vanity swap or a complete gut renovation, we handle every aspect of your bathroom remodel with the attention to detail it deserves.`,
      content: `Bathrooms take a beating in Oregon's humid climate, making quality waterproofing and materials selection critical for any renovation in ${city}. We use industry-leading waterproof membrane systems in every shower and tub surround to prevent moisture damage and mold growth.\n\nOur ${city} bathroom renovation services include custom tile showers with bench seats and niches, freestanding and built-in tub installations, vanity and countertop upgrades, and accessibility modifications for aging-in-place. We handle all plumbing coordination, electrical work, and finish carpentry.\n\nEvery bathroom renovation starts with a free consultation where we discuss your vision, budget, and timeline. We provide a detailed written estimate and 3D design concepts so you can see your new bathroom before construction begins.`,
      faq: [
        { question: `How much does a bathroom renovation cost in ${city}?`, answer: `Bathroom renovations in ${city} range from $9,000 for a basic remodel to $25,000+ for a complete renovation with custom tile, new plumbing fixtures, and high-end finishes.` },
        { question: `How long does a bathroom renovation take?`, answer: `A typical bathroom renovation in ${city} takes 2-4 weeks. Simple updates like vanity replacement take less time, while full gut renovations with tile work take closer to 4 weeks.` },
        { question: `Do you handle permits for bathroom renovations in ${city}?`, answer: `Yes, we handle all necessary permits required by Lane County for bathroom renovations, including plumbing and electrical permits when applicable.` },
      ],
    },
    'deck-fencing': {
      heroSubtitle: `Custom deck construction and fence installation in ${city}`,
      intro: `Halleman Construction builds custom decks and installs quality fencing for homeowners in ${city} and throughout Lane County. Our outdoor structures are designed to handle Oregon's rain, sun, and everything in between — built with materials and techniques that ensure decades of use.`,
      content: `Your outdoor living space is an extension of your home, and in ${city}, a well-built deck or fence adds both value and usability to your property. We build decks using premium cedar and composite materials rated for the Pacific Northwest climate, with proper drainage and ventilation to prevent rot.\n\nOur ${city} deck and fencing services include ground-level and elevated deck construction, multi-level decks with stairs and railings, privacy fences in cedar and vinyl, picket fences, and gate installation. Every project is engineered to meet Lane County building codes and permit requirements.\n\nWe handle the full process — design, permitting, construction, and staining or sealing — so you get a finished outdoor space ready to enjoy. Our decks are built with hidden fastener systems for a clean look and structural hardware rated for Oregon's seismic and wind loads.`,
      faq: [
        { question: `How much does a deck cost to build in ${city}?`, answer: `Deck construction in ${city} typically costs $19-$45 per square foot depending on material (cedar vs. composite), height, and complexity. A standard 300 sq ft deck runs $6,000-$13,500.` },
        { question: `How much does fence installation cost in ${city}?`, answer: `Fence installation in ${city} ranges from $18-$50 per linear foot depending on material and style. A 150 linear foot privacy fence typically costs $2,700-$7,500.` },
        { question: `Do I need a permit for a deck in ${city}?`, answer: `Most decks in ${city} require a building permit from Lane County. We handle all permit applications and inspections as part of our service.` },
      ],
    },
    'patio-cover': {
      heroSubtitle: `Custom patio covers and outdoor living structures in ${city}`,
      intro: `Halleman Construction designs and installs custom patio covers for homeowners in ${city} and the surrounding Lane County area. A patio cover lets you enjoy your outdoor space year-round — even during Oregon's rainy season — and adds real value to your property.`,
      content: `In ${city}, a well-built patio cover transforms your backyard from a seasonal space into a year-round living area. We build attached and freestanding patio covers using durable materials designed for the Pacific Northwest — from traditional wood beam structures to modern aluminum and polycarbonate systems.\n\nOur ${city} patio cover services include solid roof covers for full rain protection, open-beam pergolas for filtered shade, combination structures with both covered and open areas, and integrated lighting and fan installations. We work with your home's architecture to create a seamless extension of your living space.\n\nEvery patio cover project includes engineered plans, proper footings and post anchoring for Lane County's soil conditions, and finish work that matches your home's exterior. We handle permitting, construction, and final inspection so you can focus on choosing your outdoor furniture.`,
      faq: [
        { question: `How much does a patio cover cost in ${city}?`, answer: `Patio covers in ${city} typically range from $50-$150 per square foot depending on the style and materials. A standard 200 sq ft patio cover runs $10,000-$30,000.` },
        { question: `Do patio covers require permits in ${city}?`, answer: `Yes, most patio covers in ${city} require a building permit from Lane County. We handle the entire permitting process including engineered plans and inspections.` },
        { question: `How long does it take to build a patio cover?`, answer: `Most patio cover installations in ${city} take 1-3 weeks from start to finish, depending on the complexity of the design and weather conditions.` },
      ],
    },
  }

  return contentMap[serviceKey]
}

// Generate slug mappings
function generateSlug(serviceKey: string, cityKey: string): string {
  // Special case for deck-fencing: use split slugs
  if (serviceKey === 'deck-fencing') {
    return `deck-builder-${cityKey}`
  }
  return `${serviceKey}-${cityKey}`
}

function generateTitle(service: string, city: string): string {
  return `${service} ${city} OR | Halleman Construction LLC`
}

function generateDescription(service: string, city: string): string {
  return `Professional ${service.toLowerCase()} services in ${city}, Oregon. Licensed, bonded & insured contractor serving ${city} and Lane County. Free estimates. Call (541) 525-4133.`
}

function generateH1(service: string, city: string): string {
  return `${service} Services in ${city}, Oregon`
}

// Build all pages
export const seoPages: SeoPage[] = []

for (const [serviceKey, serviceData] of Object.entries(SERVICES)) {
  for (const [cityKey, cityData] of Object.entries(CITIES)) {
    const content = generateContent(serviceKey, cityKey)
    seoPages.push({
      slug: generateSlug(serviceKey, cityKey),
      title: generateTitle(serviceData.service, cityData.city),
      description: generateDescription(serviceData.service, cityData.city),
      h1: generateH1(serviceData.service, cityData.city),
      service: serviceData.service,
      city: cityData.city,
      county: cityData.county,
      heroSubtitle: content.heroSubtitle,
      intro: content.intro,
      features: serviceData.features,
      content: content.content,
      faq: content.faq,
      nearbyAreas: cityData.nearbyAreas,
      estimatorType: serviceData.estimatorType,
    })
  }
}

// Add the special broader pages
seoPages.push({
  slug: 'home-remodeling-lane-county',
  title: 'Home Remodeling Lane County OR | Complete Home Renovation',
  description: 'Professional home remodeling throughout Lane County, Oregon. Kitchen, bathroom, decks, fencing, tile, and patio covers. Licensed contractor. Free estimates.',
  h1: 'Home Remodeling Services in Lane County, Oregon',
  service: 'Home Remodeling',
  city: 'Lane County',
  county: 'Lane County',
  heroSubtitle: 'Complete home renovation services across Lane County',
  intro: 'Halleman Construction provides comprehensive home remodeling services throughout Lane County, Oregon. From Eugene to Cottage Grove, Veneta to Coburg, we bring professional craftsmanship to every project. Whether you need a single room updated or a whole-house renovation, our licensed team delivers results that last.',
  features: [
    'Kitchen remodeling and renovation',
    'Bathroom remodeling and updates',
    'Tile installation (floors, showers, backsplashes)',
    'Custom deck construction',
    'Fence installation and repair',
    'Patio cover construction',
  ],
  content: 'Lane County homeowners trust Halleman Construction for quality remodeling work at fair prices. We serve every community in the county — from the city neighborhoods of Eugene and Springfield to the rural properties around Veneta, Cottage Grove, and Coburg.\n\nOur approach is straightforward: we show up on time, communicate clearly, do quality work, and clean up when we are done. Every project gets a detailed written estimate, a realistic timeline, and a single point of contact from start to finish.\n\nAs a locally owned business in Lane County, we understand the unique challenges of building in Oregon — from rain-resistant materials to seismic code requirements. We are licensed, bonded, and insured, and we pull proper permits for every job that requires them.',
  faq: [
    { question: 'What areas in Lane County do you serve?', answer: 'We serve all of Lane County including Eugene, Springfield, Cottage Grove, Veneta, Coburg, Junction City, Creswell, and surrounding rural areas.' },
    { question: 'Are you a licensed contractor in Oregon?', answer: 'Yes, Halleman Construction is a licensed, bonded, and insured contractor in the state of Oregon, serving Lane County and surrounding areas.' },
    { question: 'How do I get a free estimate?', answer: 'Contact us through our website or call (541) 525-4133. We will schedule a time to visit your property, discuss your project, and provide a detailed written estimate at no cost.' },
  ],
  nearbyAreas: ['Eugene', 'Springfield', 'Cottage Grove', 'Veneta', 'Coburg'],
  estimatorType: null,
})

seoPages.push({
  slug: 'licensed-contractor-eugene',
  title: 'Licensed Contractor Eugene OR | Bonded & Insured | Halleman Construction',
  description: 'Licensed, bonded, and insured contractor in Eugene, Oregon. Professional construction and remodeling. Tile, kitchens, bathrooms, decks, fencing, patios. Free estimates.',
  h1: 'Licensed Contractor in Eugene, Oregon',
  service: 'General Contracting',
  city: 'Eugene',
  county: 'Lane County',
  heroSubtitle: 'Licensed, bonded, and insured construction services in Eugene',
  intro: 'When you hire Halleman Construction, you are hiring a licensed, bonded, and insured contractor who takes your project as seriously as you do. We serve Eugene and all of Lane County with professional remodeling and construction services backed by proper licensing and insurance.',
  features: [
    'Oregon CCB licensed contractor',
    'Fully bonded and insured',
    'Proper permits pulled for every job',
    'Lane County building code compliant',
    'Quality materials from trusted suppliers',
    'Transparent pricing with written estimates',
  ],
  content: 'Hiring an unlicensed contractor is one of the biggest risks a homeowner can take. In Oregon, contractors are required to be registered with the Construction Contractors Board (CCB), carry liability insurance, and maintain a surety bond. Halleman Construction meets all of these requirements.\n\nWhy does licensing matter? If something goes wrong with an unlicensed contractor, you have little legal recourse. Licensed contractors are held to state standards, carry insurance that protects your property, and are accountable to the CCB for the quality of their work.\n\nWe pull proper permits for every project that requires them in Eugene and Lane County. This means your work is inspected by the county and meets current building codes — which matters for your safety, your insurance, and your home resale value.',
  faq: [
    { question: 'How can I verify your contractor license?', answer: 'You can verify our Oregon CCB license through the Construction Contractors Board website at oregon.gov/ccb. We are happy to provide our license number upon request.' },
    { question: 'What insurance do you carry?', answer: 'We carry general liability insurance and workers compensation insurance as required by Oregon law. We can provide certificates of insurance for any project.' },
    { question: 'Do you pull permits for projects in Eugene?', answer: 'Yes, we pull all necessary building permits through Lane County for projects that require them. This includes structural work, plumbing, and electrical modifications.' },
  ],
  nearbyAreas: ['Springfield', 'Cottage Grove', 'Veneta', 'Coburg', 'Junction City'],
  estimatorType: null,
})

seoPages.push({
  slug: 'outdoor-living-eugene',
  title: 'Outdoor Living Spaces Eugene OR | Decks, Patios & More',
  description: 'Create your dream outdoor living space in Eugene, Oregon. Custom decks, patio covers, fencing, and outdoor construction. Licensed contractor. Free estimates.',
  h1: 'Outdoor Living Space Construction in Eugene, Oregon',
  service: 'Outdoor Living',
  city: 'Eugene',
  county: 'Lane County',
  heroSubtitle: 'Custom outdoor living spaces designed for Oregon living',
  intro: 'Eugene homeowners know that outdoor living is a way of life in the Pacific Northwest. Halleman Construction builds custom outdoor spaces — decks, patio covers, fencing, and more — designed to handle Oregon weather while giving you a beautiful space to enjoy year-round.',
  features: [
    'Custom deck design and construction',
    'Patio covers for year-round use',
    'Privacy and decorative fencing',
    'Outdoor lighting and electrical',
    'Pergolas and shade structures',
    'Composite and natural wood options',
  ],
  content: 'Your backyard should be more than just grass and a lawn chair. In Eugene, the right outdoor living setup lets you enjoy your property from spring through fall — and with a solid patio cover, even through the rainy season.\n\nWe build outdoor spaces that work together: a deck for entertaining, a patio cover for rain protection, fencing for privacy, and lighting so you can use the space after dark. Every component is built with Pacific Northwest weather in mind — rot-resistant materials, proper drainage, and hardware rated for our climate.\n\nWhether you want a simple deck addition or a full outdoor living transformation, we start with a free consultation to understand how you use your outdoor space and what would make it better. Then we provide a detailed design, material options at different price points, and a clear timeline.',
  faq: [
    { question: 'Can I use an outdoor living space year-round in Eugene?', answer: 'With a solid patio cover, absolutely. Many of our Eugene clients use their covered outdoor spaces 12 months a year. Add outdoor heaters and lighting and you have a true four-season room.' },
    { question: 'What materials work best for outdoor construction in Oregon?', answer: 'We recommend cedar or composite decking, aluminum or engineered wood patio covers, and cedar or vinyl fencing. All are rated for the Pacific Northwest climate and resist moisture damage.' },
    { question: 'How much does an outdoor living space cost?', answer: 'Costs vary widely based on scope. A basic deck starts around $6,000, patio covers from $10,000, and fencing from $2,700. We provide free estimates for any combination of outdoor improvements.' },
  ],
  nearbyAreas: ['Springfield', 'Cottage Grove', 'Veneta', 'Coburg', 'Junction City'],
  estimatorType: 'deck',
})

// Helper to look up a page by slug
export function getSeoPageBySlug(slug: string): SeoPage | undefined {
  return seoPages.find(p => p.slug === slug)
}

// Get all slugs for generateStaticParams
export function getAllSlugs(): string[] {
  return seoPages.map(p => p.slug)
}
