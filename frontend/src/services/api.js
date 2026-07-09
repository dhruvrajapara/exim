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
