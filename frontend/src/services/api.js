const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 8000 } = options;

  // Generate a safe cache key
  const cacheKey = `api_cache_${resource}`;
  const isGetRequest = !options.method || options.method === 'GET';

  // 1. Check for existing cache (Only for GET requests)
  const cachedData = isGetRequest ? localStorage.getItem(cacheKey) : null;

  // 2. Define the network fetch logic
  const fetchFromServer = async () => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(resource, { ...options, signal: controller.signal });
      clearTimeout(id);

      // If successful and is JSON, save to cache for the NEXT visit
      if (response.ok && isGetRequest) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const clone = response.clone();
          const textData = await clone.text();
          localStorage.setItem(cacheKey, textData);
        }
      }
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  // 3. If we have cache, return it instantly and fetch in background
  if (cachedData) {
    // Quietly update cache in background (Stale-while-revalidate)
    fetchFromServer().catch(e => console.warn('Background fetch failed:', e.message));

    // Instantly return the cached response
    return new Response(cachedData, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 4. If no cache, wait for the network request (with 8s timeout)
  return await fetchFromServer();
};
export const fetchDashboardStats = async () => {
  try {
    const response = await fetch('/api/admin/dashboard');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
};

export const fetchHeroSlides = async () => {
  try {
    const response = await fetchWithTimeout('/api/hero-slides');
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
    const response = await fetchWithTimeout(`/api/section-settings/${key}`);
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const updateSectionSetting = async (key, data) => {
  try {
    const response = await fetch(`/api/admin/section-settings/${key}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update section setting');
    return result;
  } catch (error) {
    console.error('Error updating section setting:', error);
    throw error;
  }
};

export const fetchProductCategories = async (query = '') => {
  try {
    const response = await fetchWithTimeout(`/api/product-categories${query}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const fetchProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithTimeout(`/api/products?${queryParams}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const fetchAboutSection = async () => {
  try {
    const response = await fetchWithTimeout('/api/about-section');
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
    const response = await fetchWithTimeout('/api/featured-products');
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
    const response = await fetchWithTimeout('/api/certifications');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const fetchLatestBlogs = async () => {
  try {
    const response = await fetchWithTimeout('/api/latest-blogs');
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
    const response = await fetchWithTimeout('/api/footer');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      footer: {
        company_logo: '/logo.png',
        company_description: '',
        social_links: [],
        quick_links: [],
        office_addresses: [],
        contact_numbers: [],
        email_addresses: [],
        copyright_text: `© ${new Date().getFullYear()} BiteExport. All Rights Reserved.`,
        bottom_links: []
      },
      categories: []
    };
  }
};

export const fetchWhyChooseUs = async () => {
  try {
    const response = await fetchWithTimeout('/api/why-choose-us');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const fetchAdminWhyChooseUs = async () => {
  try {
    const response = await fetch('/api/admin/why-choose-us');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed to return JSON');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching admin why choose us:', error);
    return [];
  }
};

export const createWhyChooseUs = async (formData) => {
  try {
    const response = await fetch('/api/admin/why-choose-us', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create item. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating why choose us item:', error);
    throw error;
  }
};

export const updateWhyChooseUs = async (id, formData) => {
  try {
    formData.append('_method', 'PUT');
    const response = await fetch(`/api/admin/why-choose-us/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update item. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating why choose us item:', error);
    throw error;
  }
};

export const deleteWhyChooseUs = async (id) => {
  try {
    const response = await fetch(`/api/admin/why-choose-us/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete item. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting why choose us item:', error);
    throw error;
  }
};

export const fetchVisionMission = async () => {
  try {
    const response = await fetchWithTimeout('/api/vision-mission');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const fetchAdminVisionMission = async () => {
  try {
    const response = await fetch('/api/admin/vision-mission');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed to return JSON');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching admin vision mission:', error);
    return [];
  }
};

export const createVisionMission = async (formData) => {
  try {
    const response = await fetch('/api/admin/vision-mission', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to create vision/mission. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating vision/mission:', error);
    throw error;
  }
};

export const updateVisionMission = async (id, formData) => {
  try {
    formData.append('_method', 'PUT');
    const response = await fetch(`/api/admin/vision-mission/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update vision/mission. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating vision/mission:', error);
    throw error;
  }
};

export const deleteVisionMission = async (id) => {
  try {
    const response = await fetch(`/api/admin/vision-mission/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete vision/mission. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting vision/mission:', error);
    throw error;
  }
};

export const fetchTeamMembers = async () => {
  try {
    const response = await fetchWithTimeout('/api/team-members');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};;
export const fetchProductBySlug = async (slug) => {
  try {
    const response = await fetchWithTimeout(`/api/products/${slug}`);
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
      main_image: product.image_path ? product.image_path : '',
      seo_image: product.seo_image ? product.seo_image : '',
      gallery: product.gallery ? product.gallery : [],
      specifications: product.specifications ? product.specifications : [],
      features: product.features ? product.features.map(f => ({ title: f })) : [],
      faqs: product.faqs ? product.faqs : []
    };
  } catch (error) {
    return null;
  }
};

export const fetchRelatedProducts = async (categorySlug) => {
  try {
    const response = await fetchWithTimeout(`/api/products/related/${categorySlug}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const fetchBlogCategories = async () => {
  try {
    const response = await fetchWithTimeout('/api/blog-categories');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const fetchFeaturedBlog = async () => {
  try {
    const response = await fetchWithTimeout('/api/blogs/featured');
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
};

export const fetchBlogs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetchWithTimeout(`/api/blogs?${queryParams}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};

export const fetchBlogBySlug = async (slug) => {
  try {
    const response = await fetchWithTimeout(`/api/blogs/${slug}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
};

export const fetchRelatedBlogs = async (categorySlug) => {
  try {
    const response = await fetchWithTimeout(`/api/blogs/related/${categorySlug}`);
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      throw new Error('API failed');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    return [];
  }
};;

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
      headers: { 'Accept': 'application/json' },
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
      headers: { 'Accept': 'application/json' },
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

// Admin Testimonial API Methods
export const fetchTestimonials = async () => {
  try {
    const response = await fetchWithTimeout('/api/testimonials');
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    return [];
  }
};

export const fetchAdminTestimonials = async () => {
  try {
    const response = await fetch('/api/admin/testimonials');
    if (!response.ok) throw new Error('Failed to fetch admin testimonials');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    throw error;
  }
};

export const createTestimonial = async (formData) => {
  try {
    const response = await fetch('/api/admin/testimonials', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create testimonial');
    return data;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

export const updateTestimonial = async (id, formData) => {
  try {
    const response = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update testimonial');
    return data;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const response = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete testimonial');
    return await response.json();
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};

// Admin Team Members API Methods
export const fetchAdminTeamMembers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/admin/team-members?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch admin team members');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching admin team members:', error);
    throw error;
  }
};

export const createTeamMember = async (formData) => {
  try {
    const response = await fetch('/api/admin/team-members', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData,
    });
    let data;
    try {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON. Raw response:", text);
        throw e; // rethrow to be caught by outer catch
      }
    } catch (e) {
      throw e;
    }

    if (!response.ok) throw new Error(data.message || 'Failed to create team member');
    return data;
  } catch (error) {
    console.error('Error creating team member:', error);
    throw error;
  }
};

export const updateTeamMember = async (id, formData) => {
  try {
    const response = await fetch(`/api/admin/team-members/${id}`, {
      method: 'POST', // Using POST to support multipart/form-data for image uploads
      headers: { 'Accept': 'application/json' },
      body: formData,
    });
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response received:", text);
      throw new Error("Server returned an invalid response. Check console for details.");
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update team member');
    return data;
  } catch (error) {
    console.error('Error updating team member:', error);
    throw error;
  }
};

export const deleteTeamMember = async (id) => {
  try {
    const response = await fetch(`/api/admin/team-members/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete team member');
    return await response.json();
  } catch (error) {
    console.error('Error deleting team member:', error);
    throw error;
  }
};

export const updateTeamMemberStatus = async (id, status) => {
  try {
    const response = await fetch(`/api/admin/team-members/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update status');
    return data;
  } catch (error) {
    console.error('Error updating team member status:', error);
    throw error;
  }
};

// Subscribers API
export const subscribeNewsletter = async (email) => {
  try {
    const response = await fetch('/api/subscribers', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to subscribe');
    return data;
  } catch (error) {
    console.error('Error subscribing:', error);
    throw error;
  }
};

export const getAdminSubscribers = async () => {
  try {
    const response = await fetch('/api/admin/subscribers');
    if (!response.ok) throw new Error('Failed to fetch subscribers');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching admin subscribers:', error);
    return [];
  }
};

export const deleteSubscriber = async (id) => {
  try {
    const response = await fetch(`/api/admin/subscribers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete subscriber');
    return await response.json();
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    throw error;
  }
};

export const getCampaignLogs = async () => {
  try {
    const response = await fetch('/api/admin/subscribers/campaign-logs');
    if (!response.ok) throw new Error('Failed to fetch campaign logs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaign logs:', error);
    return [];
  }
};
