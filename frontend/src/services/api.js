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
    if (!response.ok) {
      throw new Error('Failed to fetch certifications');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
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
    if (!response.ok) {
      throw new Error('Failed to fetch why choose us');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching why choose us (using fallback):', error);
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
