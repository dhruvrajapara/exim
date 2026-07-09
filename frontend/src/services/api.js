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
