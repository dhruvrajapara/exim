import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import BlogCard from './BlogCard';
import { fetchRelatedBlogs } from '../../services/api';

export default function RelatedBlogs({ categorySlug }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) return;

    const loadData = async () => {
      setLoading(true);
      const data = await fetchRelatedBlogs(categorySlug);
      setBlogs(data);
      setLoading(false);
    };

    loadData();
  }, [categorySlug]);

  if (loading || !blogs || blogs.length === 0) return null;

  return (
    <div className="mt-16 md:mt-20">
      <h3 className="font-rubik text-[28px] lg:text-[32px] font-bold text-dark mb-8">
        Related Articles
      </h3>
      
      <div className="relative pb-12">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 }
          }}
          className="blog-slider"
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id} className="pb-4">
              <BlogCard blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
