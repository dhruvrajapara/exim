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

export const fetchSectionSetting = async (key) => {
  try {
    const response = await fetch(`/api/section-settings/${key}`);
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const fetchProductCategories = async (query = '') => {
  try {
    const response = await fetch(`/api/product-categories${query}`);
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
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      footer: {
        company_logo: '/hero.png',
        company_description: 'BiteExport is a trusted merchant exporter specializing in premium dehydrated vegetables, spices, and agricultural products, serving buyers across international markets.',
        social_links: [
          { platform: 'facebook', url: 'https://facebook.com' },
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'linkedin', url: 'https://linkedin.com' },
          { platform: 'youtube', url: 'https://youtube.com' },
          { platform: 'whatsapp', url: 'https://whatsapp.com' }
        ],
        quick_links: [
          { label: 'Home', url: '/' },
          { label: 'About', url: '/about' },
          { label: 'Products', url: '/products' },
          { label: 'Team', url: '/team' },
          { label: 'Blog', url: '/blog' },
          { label: 'Gallery', url: '/gallery' },
          { label: 'Contact', url: '/contact' }
        ],
        office_addresses: [
          '123 Export Avenue, Global Trade Center, Mumbai, India',
          '45 International Business Hub, Dubai, UAE'
        ],
        contact_numbers: [
          '+91 98765 43210',
          '+971 50 123 4567'
        ],
        email_addresses: [
          'info@biteexport.com',
          'sales@biteexport.com'
        ],
        copyright_text: `© ${new Date().getFullYear()} BiteExport. All Rights Reserved.`,
        bottom_links: []
      },
      categories: [
        { id: 1, name: 'Dehydrated Onion', slug: 'dehydrated-onion' },
        { id: 2, name: 'Dehydrated Garlic', slug: 'dehydrated-garlic' },
        { id: 3, name: 'Spice Powder', slug: 'spice-powder' },
        { id: 4, name: 'Vegetable Powder', slug: 'vegetable-powder' },
        { id: 5, name: 'Herbs', slug: 'herbs' }
      ]
    };
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
    const product = data.data;
    
    // Format backend data to match frontend expectations
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category ? product.category.name : 'Uncategorized',
      category_slug: product.category ? product.category.slug : '',
      short_description: product.short_description,
      full_description: product.full_description,
      main_image: product.image_path ? `http://localhost:8000${product.image_path}` : '',
      gallery: product.gallery ? product.gallery.map(path => `http://localhost:8000${path}`) : [],
      specifications: product.specifications ? product.specifications.map(s => ({ name: s.key, value: s.value })) : [],
      features: product.features ? product.features.map(f => ({ title: f })) : []
    };
  } catch (error) {
    // Rich fallback data for any requested product if backend fails
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
        'https://images.unsplash.com/photo-1596647901016-1f6b1587d46c?w=1000&q=80'
      ],
      specifications: [
        { key: 'HS Code', value: '07122000' },
        { key: 'Origin', value: 'India' }
      ],
      features: [
        { title: 'Premium Quality' },
        { title: 'Export Standard' }
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

export const fetchBlogCategories = async () => {
  try {
    throw new Error('Bypass fetch for instant load during dev');
    const response = await fetch('/api/blog-categories');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [
      { id: 1, name: 'Export Guides', slug: 'export-guides' },
      { id: 2, name: 'Market Trends', slug: 'market-trends' },
      { id: 3, name: 'Product Insights', slug: 'product-insights' },
      { id: 4, name: 'Company News', slug: 'company-news' }
    ];
  }
};

export const fetchFeaturedBlog = async () => {
  try {
    throw new Error('Bypass fetch for instant load during dev');
    const response = await fetch('/api/blogs/featured');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return {
      id: 99,
      title: 'The Ultimate Guide to Exporting Dehydrated Vegetables in 2026',
      slug: 'guide-to-exporting-dehydrated-vegetables-2026',
      category: 'Export Guides',
      category_slug: 'export-guides',
      featured_image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80',
      short_description: 'Discover the latest regulations, packaging standards, and global demand trends for exporting high-quality dehydrated vegetables to Europe and North America.',
      published_date: '2026-06-15',
      author: 'Dhruv Rajapara'
    };
  }
};

export const fetchBlogs = async (filters = {}) => {
  try {
    throw new Error('Bypass fetch for instant load during dev');
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/blogs?${queryParams}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    const allBlogs = [
      { id: 1, title: 'Top 5 Spices in Demand Globally', slug: 'top-5-spices', category: 'Market Trends', category_slug: 'market-trends', featured_image: 'https://images.unsplash.com/photo-1615484477201-cb8633783a60?w=600&q=80', short_description: 'An analysis of the most sought-after Indian spices in the international market.', published_date: '2026-07-01', reading_time: '4 min read', trending: true, author: 'Dhruv Rajapara' },
      { id: 2, title: 'How We Maintain Food Safety Standards', slug: 'food-safety-standards', category: 'Company News', category_slug: 'company-news', featured_image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', short_description: 'A deep dive into our quality control processes and certifications.', published_date: '2026-06-28', reading_time: '6 min read', trending: true, author: 'Aisha Sharma' },
      { id: 3, title: 'Benefits of Dehydrated Garlic', slug: 'benefits-dehydrated-garlic', category: 'Product Insights', category_slug: 'product-insights', featured_image: 'https://images.unsplash.com/photo-1596647901016-1f6b1587d46c?w=600&q=80', short_description: 'Why more food manufacturers are switching to dehydrated garlic powder.', published_date: '2026-06-20', reading_time: '3 min read', trending: false, author: 'Rohan Mehta' },
      { id: 4, title: 'Navigating European Import Laws', slug: 'european-import-laws', category: 'Export Guides', category_slug: 'export-guides', featured_image: 'https://images.unsplash.com/photo-1518568740560-333181a1796a?w=600&q=80', short_description: 'Everything you need to know about exporting agriculture products to the EU.', published_date: '2026-06-10', reading_time: '8 min read', trending: true, author: 'Dhruv Rajapara' },
      { id: 5, title: 'Sustainable Farming Practices', slug: 'sustainable-farming', category: 'Company News', category_slug: 'company-news', featured_image: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bf?w=600&q=80', short_description: 'How BiteExport partners with local farmers for sustainable agriculture.', published_date: '2026-06-05', reading_time: '5 min read', trending: false, author: 'Priya Patel' },
      { id: 6, title: 'The Rise of Ready-to-Eat Meals', slug: 'ready-to-eat-meals', category: 'Market Trends', category_slug: 'market-trends', featured_image: 'https://images.unsplash.com/photo-1615485925761-4be66a01b7a2?w=600&q=80', short_description: 'How the global shift towards convenience is driving dehydrated ingredient sales.', published_date: '2026-05-28', reading_time: '4 min read', trending: true, author: 'Dhruv Rajapara' },
      { id: 7, title: 'Choosing the Right Packaging for Exports', slug: 'choosing-packaging-exports', category: 'Export Guides', category_slug: 'export-guides', featured_image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80', short_description: 'A comprehensive guide to moisture-proof packaging for dehydrated vegetables.', published_date: '2026-05-15', reading_time: '7 min read', trending: false, author: 'Rohan Mehta' },
      { id: 8, title: 'Understanding Phytosanitary Certificates', slug: 'understanding-phytosanitary', category: 'Export Guides', category_slug: 'export-guides', featured_image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80', short_description: 'Why you need a phytosanitary certificate and how to obtain one.', published_date: '2026-05-10', reading_time: '5 min read', trending: false, author: 'Dhruv Rajapara' },
      { id: 9, title: 'Top Importers of Dehydrated Onion', slug: 'top-importers-onion', category: 'Market Trends', category_slug: 'market-trends', featured_image: 'https://images.unsplash.com/photo-1518568740560-333181a1796a?w=600&q=80', short_description: 'A look at the countries importing the most dehydrated onion in 2026.', published_date: '2026-05-02', reading_time: '4 min read', trending: false, author: 'Aisha Sharma' },
      { id: 10, title: 'How Climate Change Affects Crop Yields', slug: 'climate-change-crops', category: 'Product Insights', category_slug: 'product-insights', featured_image: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bf?w=600&q=80', short_description: 'Analyzing the impact of changing weather patterns on global spice production.', published_date: '2026-04-20', reading_time: '6 min read', trending: true, author: 'Priya Patel' },
      { id: 11, title: 'Our New Facility in Gujarat', slug: 'new-facility-gujarat', category: 'Company News', category_slug: 'company-news', featured_image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', short_description: 'BiteExport expands operations with a state-of-the-art processing facility.', published_date: '2026-04-15', reading_time: '3 min read', trending: false, author: 'Rohan Mehta' },
      { id: 12, title: 'Why Buy Dehydrated vs Fresh?', slug: 'dehydrated-vs-fresh', category: 'Product Insights', category_slug: 'product-insights', featured_image: 'https://images.unsplash.com/photo-1596647901016-1f6b1587d46c?w=600&q=80', short_description: 'A cost-benefit analysis of dehydrated vegetables for restaurant chains.', published_date: '2026-04-05', reading_time: '5 min read', trending: false, author: 'Dhruv Rajapara' },
    ];

    let filtered = allBlogs;
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(b => b.category_slug === filters.category);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(b => b.title.toLowerCase().includes(s) || b.short_description.toLowerCase().includes(s));
    }
    return filtered;
  }
};

export const fetchBlogBySlug = async (slug) => {
  try {
    throw new Error('Bypass fetch for instant load during dev');
    const response = await fetch(`/api/blogs/${slug}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    const blogTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    return {
      id: 100,
      title: blogTitle || 'The Ultimate Guide to Exporting Dehydrated Vegetables in 2026',
      slug: slug,
      category: 'Export Guides',
      category_slug: 'export-guides',
      featured_image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80',
      short_description: 'Discover the latest regulations, packaging standards, and global demand trends for exporting high-quality dehydrated vegetables to Europe and North America.',
      published_date: '2026-06-15',
      reading_time: '8 min read',
      views: '12,450',
      author: 'Dhruv Rajapara',
      author_image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      author_designation: 'Head of Export Operations',
      author_bio: 'Dhruv has over 15 years of experience in the global agricultural export market, specializing in dehydrated vegetables and international food safety regulations.',
      content: `
        <h2>The Global Demand for Dehydrated Vegetables</h2>
        <p>In recent years, the global market for dehydrated vegetables has experienced unprecedented growth. Driven by the rising demand for convenience foods, long shelf-life ingredients, and emergency food supplies, exporting dehydrated onions, garlic, and tomatoes has never been more lucrative.</p>
        
        <h3>1. Quality Control and Sourcing</h3>
        <p>To succeed in the highly competitive European and North American markets, <strong>quality is paramount</strong>. Buyers demand products that are free from foreign matter, pesticides, and microbial contamination. This requires stringent sorting, grading, and testing protocols before packaging.</p>
        
        <blockquote>
          "Exporting isn't just about finding buyers; it's about building trust through consistent, unwavering product quality."
        </blockquote>
        
        <h3>2. Packaging Standards</h3>
        <p>Moisture is the enemy of dehydrated products. Exporters must utilize export-grade packaging, typically involving:</p>
        <ul>
          <li>High-density polyethylene (HDPE) inner liners</li>
          <li>Vacuum-sealed aluminum foil bags</li>
          <li>Double-wall corrugated cartons</li>
        </ul>
        
        <h3>3. Navigating Customs and Documentation</h3>
        <p>Documentation is the backbone of international trade. Ensure that you have your Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, and Phytosanitary Certificate perfectly aligned. A single typo can result in customs delays costing thousands of dollars.</p>
        
        <h2>Conclusion</h2>
        <p>Exporting dehydrated vegetables in 2026 offers massive potential for those who prioritize food safety, premium packaging, and robust supply chain management. By partnering with a trusted merchant exporter like BiteExport, you can navigate these complexities with ease.</p>
      `
    };
  }
};

export const fetchRelatedBlogs = async (categorySlug) => {
  try {
    throw new Error('Bypass fetch for instant load during dev');
    const response = await fetch(`/api/blogs/related/${categorySlug}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('Fallback triggered');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [
      { id: 1, title: 'Top 5 Spices in Demand Globally', slug: 'top-5-spices', category: 'Market Trends', category_slug: 'market-trends', featured_image: 'https://images.unsplash.com/photo-1615484477201-cb8633783a60?w=600&q=80', short_description: 'An analysis of the most sought-after Indian spices in the international market.', published_date: '2026-07-01', reading_time: '4 min read', trending: true, author: 'Dhruv Rajapara' },
      { id: 2, title: 'How We Maintain Food Safety Standards', slug: 'food-safety-standards', category: 'Company News', category_slug: 'company-news', featured_image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', short_description: 'A deep dive into our quality control processes and certifications.', published_date: '2026-06-28', reading_time: '6 min read', trending: true, author: 'Aisha Sharma' },
      { id: 3, title: 'Benefits of Dehydrated Garlic', slug: 'benefits-dehydrated-garlic', category: 'Product Insights', category_slug: 'product-insights', featured_image: 'https://images.unsplash.com/photo-1596647901016-1f6b1587d46c?w=600&q=80', short_description: 'Why more food manufacturers are switching to dehydrated garlic powder.', published_date: '2026-06-20', reading_time: '3 min read', trending: false, author: 'Rohan Mehta' },
      { id: 4, title: 'Navigating European Import Laws', slug: 'european-import-laws', category: 'Export Guides', category_slug: 'export-guides', featured_image: 'https://images.unsplash.com/photo-1518568740560-333181a1796a?w=600&q=80', short_description: 'Everything you need to know about exporting agriculture products to the EU.', published_date: '2026-06-10', reading_time: '8 min read', trending: true, author: 'Dhruv Rajapara' }
    ];
  }
};

// Admin Certification API Methods
export const fetchAdminCertifications = async () => {
  try {
    const response = await fetch('/api/admin/certifications');
    if (!response.ok) throw new Error('Failed to fetch certifications');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching admin certifications:', error);
    throw error;
  }
};

export const createCertification = async (formData) => {
  try {
    const response = await fetch('/api/admin/certifications', {
      method: 'POST',
      body: formData, // FormData handles its own content-type for files
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create certification');
    return data;
  } catch (error) {
    console.error('Error creating certification:', error);
    throw error;
  }
};

export const updateCertification = async (id, formData) => {
  try {
    const response = await fetch(`/api/admin/certifications/${id}`, {
      method: 'POST', // Using POST for form-data containing files, backend handles method spoofing or interprets correctly
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update certification');
    return data;
  } catch (error) {
    console.error('Error updating certification:', error);
    throw error;
  }
};

export const deleteCertification = async (id) => {
  try {
    const response = await fetch(`/api/admin/certifications/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete certification');
    return await response.json();
  } catch (error) {
    console.error('Error deleting certification:', error);
    throw error;
  }
};
