export const fetchHeroSlides = async () => {
  try {
    const response = await fetch('/api/hero-slides');
    if (!response.ok) {
      throw new Error('Failed to fetch hero slides');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return [];
  }
};

export const fetchProductCategories = async () => {
  try {
    const response = await fetch('/api/product-categories');
    if (!response.ok) {
      throw new Error('Failed to fetch product categories');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }
};

export const fetchAboutSection = async () => {
  try {
    const response = await fetch('/api/about-section');
    if (!response.ok) {
      throw new Error('Failed to fetch about section');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching about section:', error);
    return null;
  }
};

export const fetchFeaturedProducts = async () => {
  try {
    const response = await fetch('/api/featured-products');
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

export const fetchCertifications = async () => {
  try {
    const response = await fetch('/api/certifications');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    // Return fallback data with 4 requested certificates
    return [
      {
        id: 1,
        name: 'GST Registration',
        authority_name: 'Government of India',
        logo_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GST_Logo.svg/256px-GST_Logo.svg.png',
        short_description: 'Registered under the Goods and Services Tax act for transparent trade operations.',
        verification_badge_text: 'Government Registered'
      },
      {
        id: 2,
        name: 'FSSAI License',
        authority_name: 'Food Safety and Standards Authority',
        logo_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/FSSAI_logo.svg/256px-FSSAI_logo.svg.png',
        short_description: 'Certified to maintain the highest food safety and quality standards for export.',
        verification_badge_text: 'Food Safety Certified'
      },
      {
        id: 3,
        name: 'APEDA Registration',
        authority_name: 'Ministry of Commerce & Industry',
        logo_path: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/APEDA_Logo.svg/256px-APEDA_Logo.svg.png',
        short_description: 'Officially registered exporter for agricultural and processed food products.',
        verification_badge_text: 'Export Compliant'
      },
      {
        id: 4,
        name: 'Import Export Code (IEC)',
        authority_name: 'Directorate General of Foreign Trade',
        logo_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/256px-Emblem_of_India.svg.png',
        short_description: 'Authorized by DGFT for international trade and global supply chain operations.',
        verification_badge_text: 'Trade Authorized'
      }
    ];
  }
};

export const fetchLatestBlogs = async () => {
  try {
    const response = await fetch('/api/latest-blogs');
    if (!response.ok) {
      throw new Error('Failed to fetch latest blogs');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return [];
  }
};

export const fetchFooter = async () => {
  try {
    const response = await fetch('/api/footer');
    if (!response.ok) {
      throw new Error('Failed to fetch footer');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching footer:', error);
    return null;
  }
};

export const fetchWhyChooseUs = async () => {
  try {
    const response = await fetch('/api/why-choose-us');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    // Suppressed console.error to keep the console clean during frontend development
    // Robust fallback data for the frontend to render perfectly while backend is built
    return [
      { id: 1, title: 'Premium Quality Products', short_description: 'We source and deliver only the highest grade agricultural products.', icon: 'WorkspacePremium' },
      { id: 2, title: 'Competitive Pricing', short_description: 'Direct sourcing allows us to offer the best prices in the global market.', icon: 'Verified' },
      { id: 3, title: 'On-Time Global Delivery', short_description: 'We ensure strict adherence to shipping schedules and timely delivery.', icon: 'LocalShipping' },
      { id: 4, title: 'Strict Quality Inspection', short_description: 'Every shipment undergoes rigorous multi-stage quality checks.', icon: 'AssignmentTurnedIn' },
      { id: 5, title: 'Export Documentation', short_description: 'Complete support for all customs and international trade paperwork.', icon: 'Inventory2' },
      { id: 6, title: 'Secure Packaging', short_description: 'Export-grade secure packaging to maintain freshness and prevent damage.', icon: 'Inventory2' },
      { id: 7, title: 'Fast Buyer Support', short_description: '24/7 dedicated support team to assist international buyers instantly.', icon: 'SupportAgent' },
      { id: 8, title: 'Long-Term Partnership', short_description: 'We believe in building trustworthy and lasting business relationships.', icon: 'Handshake' }
    ];
  }
};

export const fetchVisionMission = async () => {
  try {
    const response = await fetch('/api/vision-mission');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    // Suppressed console.error to keep the console clean during frontend development
    // Fallback data
    return [
      { 
        id: 1, 
        type: 'vision', 
        label: 'OUR VISION', 
        title: 'Empowering Global Trade', 
        description: 'To become the world\'s most trusted exporter of premium agricultural products, bridging the gap between local farmers and international markets with uncompromising quality and sustainable practices.', 
        icon: 'Visibility' 
      },
      { 
        id: 2, 
        type: 'mission', 
        label: 'OUR MISSION', 
        title: 'Delivering Excellence Daily', 
        description: 'To source, process, and deliver the finest quality products while maintaining competitive pricing, strict international food safety standards, and building long-lasting partnerships globally.', 
        icon: 'TrackChanges' 
      }
    ];
  }
};

export const fetchTestimonials = async () => {
  try {
    const response = await fetch('/api/testimonials');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [
      {
        id: 1,
        client_name: 'John Doe',
        company_name: 'Global Fresh Imports',
        country: 'USA',
        flag_code: 'us',
        avatar_url: 'https://i.pravatar.cc/150?img=11',
        star_rating: 5,
        review_text: 'BiteExport has been an incredible partner. Their agricultural products are of the highest quality and consistently delivered on time.'
      },
      {
        id: 2,
        client_name: 'Maria Garcia',
        company_name: 'Mercado European Foods',
        country: 'Spain',
        flag_code: 'es',
        avatar_url: 'https://i.pravatar.cc/150?img=47',
        star_rating: 5,
        review_text: 'We highly recommend their services. The stringent quality control and transparent documentation make importing completely stress-free.'
      },
      {
        id: 3,
        client_name: 'Liam Chen',
        company_name: 'Asia Pacific Traders',
        country: 'Singapore',
        flag_code: 'sg',
        avatar_url: 'https://i.pravatar.cc/150?img=15',
        star_rating: 4,
        review_text: 'Excellent packaging and competitive pricing. The support team is highly responsive to all our international trade inquiries.'
      },
      {
        id: 4,
        client_name: 'Sarah Smith',
        company_name: 'UK Organics Ltd',
        country: 'UK',
        flag_code: 'gb',
        avatar_url: 'https://i.pravatar.cc/150?img=32',
        star_rating: 5,
        review_text: 'Their commitment to sustainability and quality is evident in every shipment. Truly a reliable long-term export partner.'
      }
    ];
  }
};
