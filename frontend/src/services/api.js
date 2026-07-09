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
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [
      { id: 1, name: 'Dehydrated Onion', slug: 'dehydrated-onion' },
      { id: 2, name: 'Dehydrated Garlic', slug: 'dehydrated-garlic' },
      { id: 3, name: 'Spice Powder', slug: 'spice-powder' },
      { id: 4, name: 'Vegetable Powder', slug: 'vegetable-powder' },
      { id: 5, name: 'Herbs', slug: 'herbs' }
    ];
  }
};

export const fetchProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/products?${queryParams}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    // Fallback data
    const allProducts = [
      { id: 1, name: 'Premium Dehydrated Onion Flakes', category: 'Dehydrated Onion', category_slug: 'dehydrated-onion', image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=500&q=80', short_description: 'High-quality dehydrated white onion flakes perfect for culinary use.', slug: 'premium-dehydrated-onion-flakes' },
      { id: 2, name: 'Dehydrated Garlic Powder', category: 'Dehydrated Garlic', category_slug: 'dehydrated-garlic', image: 'https://images.unsplash.com/photo-1596647901016-1f6b1587d46c?w=500&q=80', short_description: 'Fine garlic powder with strong aroma and long shelf life.', slug: 'dehydrated-garlic-powder' },
      { id: 3, name: 'Organic Turmeric Powder', category: 'Spice Powder', category_slug: 'spice-powder', image: 'https://images.unsplash.com/photo-1615484477201-cb8633783a60?w=500&q=80', short_description: '100% natural, high-curcumin turmeric powder from Indian farms.', slug: 'organic-turmeric-powder' },
      { id: 4, name: 'Dehydrated Red Onion Powder', category: 'Dehydrated Onion', category_slug: 'dehydrated-onion', image: 'https://images.unsplash.com/photo-1518568740560-333181a1796a?w=500&q=80', short_description: 'Rich red onion powder for soups, sauces, and ready-to-eat meals.', slug: 'dehydrated-red-onion-powder' },
      { id: 5, name: 'Cumin Seed Powder', category: 'Spice Powder', category_slug: 'spice-powder', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80', short_description: 'Aromatic cumin powder processed under strict hygienic conditions.', slug: 'cumin-seed-powder' },
      { id: 6, name: 'Dehydrated Tomato Powder', category: 'Vegetable Powder', category_slug: 'vegetable-powder', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&q=80', short_description: 'Spray-dried tomato powder for instant soups and seasoning.', slug: 'dehydrated-tomato-powder' },
      { id: 7, name: 'Dried Oregano Leaves', category: 'Herbs', category_slug: 'herbs', image: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bf?w=500&q=80', short_description: 'Premium dried oregano perfect for pizza and pasta seasoning.', slug: 'dried-oregano-leaves' },
      { id: 8, name: 'Garlic Granules', category: 'Dehydrated Garlic', category_slug: 'dehydrated-garlic', image: 'https://images.unsplash.com/photo-1615485925761-4be66a01b7a2?w=500&q=80', short_description: 'Uniform garlic granules ideal for meat processing and marinades.', slug: 'garlic-granules' }
    ];

    // Simulate filtering
    let filtered = allProducts;
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category_slug === filters.category);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
    }

    return filtered;
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

export const fetchTeamMembers = async () => {
  try {
    const response = await fetch('/api/team-members');
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
        full_name: 'Dhruv Rajapara',
        role: 'Founder & CEO',
        profile_image: 'https://i.pravatar.cc/300?img=11',
        short_description: 'Leading BiteExport with a vision to deliver premium Indian agricultural products to global markets.',
        social_links: {
          linkedin: 'https://linkedin.com',
          email: 'founder@biteexport.com'
        }
      },
      {
        id: 2,
        full_name: 'Aisha Sharma',
        role: 'Head of Quality Assurance',
        profile_image: 'https://i.pravatar.cc/300?img=5',
        short_description: 'Ensuring every export shipment strictly adheres to international food safety standards.',
        social_links: {
          linkedin: 'https://linkedin.com',
          email: 'qa@biteexport.com'
        }
      },
      {
        id: 3,
        full_name: 'Rohan Mehta',
        role: 'Global Logistics Director',
        profile_image: 'https://i.pravatar.cc/300?img=15',
        short_description: 'Optimizing supply chains for fast, secure, and cost-effective international deliveries.',
        social_links: {
          linkedin: 'https://linkedin.com'
        }
      },
      {
        id: 4,
        full_name: 'Priya Patel',
        role: 'International Relations',
        profile_image: 'https://i.pravatar.cc/300?img=9',
        short_description: 'Building strong, trustworthy, and long-lasting partnerships with our buyers worldwide.',
        social_links: {
          linkedin: 'https://linkedin.com',
          email: 'relations@biteexport.com',
          whatsapp: '1234567890'
        }
      }
    ];
  }
};
export const fetchProductBySlug = async (slug) => {
  try {
    const response = await fetch(`/api/products/${slug}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    // Rich fallback data for any requested product
    const productTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      id: 99,
      name: productTitle || 'Premium Export Product',
      slug: slug,
      category: 'Dehydrated Products',
      category_slug: 'dehydrated-products',
      short_description: 'High-quality agricultural product processed under strict international food safety standards.',
      full_description: 'At BiteExport, we ensure that our agricultural products are naturally grown, carefully harvested, and hygienically processed to retain their authentic aroma, taste, and nutritional value. This product is ideal for industrial food processing, catering, and retail packaging globally.',
      main_image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=1000&q=80',
        'https://images.unsplash.com/photo-1596647901016-1f6b1587d46c?w=1000&q=80',
        'https://images.unsplash.com/photo-1615484477201-cb8633783a60?w=1000&q=80',
        'https://images.unsplash.com/photo-1518568740560-333181a1796a?w=1000&q=80'
      ],
      specifications: [
        { name: 'HS Code', value: '07122000' },
        { name: 'Origin', value: 'India' },
        { name: 'Shelf Life', value: '24 Months' },
        { name: 'Moisture', value: '< 5%' },
        { name: 'Color', value: 'Natural White / Pale Yellow' },
        { name: 'Packaging', value: '25 Kg Vacuum Bag / As per requirement' }
      ],
      features: [
        { title: 'Premium Quality' },
        { title: 'Export Standard' },
        { title: 'Hygienically Processed' },
        { title: 'Long Shelf Life' }
      ]
    };
  }
};

export const fetchRelatedProducts = async (categorySlug) => {
  try {
    const response = await fetch(`/api/products/related/${categorySlug}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [
      { id: 1, name: 'Premium Dehydrated Onion Flakes', category: 'Dehydrated Onion', slug: 'premium-dehydrated-onion-flakes', image: 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=500&q=80', short_description: 'High-quality dehydrated white onion flakes perfect for culinary use.' },
      { id: 2, name: 'Dehydrated Garlic Powder', category: 'Dehydrated Garlic', slug: 'dehydrated-garlic-powder', image: 'https://images.unsplash.com/photo-1596647901016-1f6b1587d46c?w=500&q=80', short_description: 'Fine garlic powder with strong aroma and long shelf life.' },
      { id: 4, name: 'Dehydrated Red Onion Powder', category: 'Dehydrated Onion', slug: 'dehydrated-red-onion-powder', image: 'https://images.unsplash.com/photo-1518568740560-333181a1796a?w=500&q=80', short_description: 'Rich red onion powder for soups, sauces, and ready-to-eat meals.' },
      { id: 8, name: 'Garlic Granules', category: 'Dehydrated Garlic', slug: 'garlic-granules', image: 'https://images.unsplash.com/photo-1615485925761-4be66a01b7a2?w=500&q=80', short_description: 'Uniform garlic granules ideal for meat processing and marinades.' }
    ];
  }
};
