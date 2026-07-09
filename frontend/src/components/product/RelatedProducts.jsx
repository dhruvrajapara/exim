import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import ProductCard from '../ProductCard';
import { fetchRelatedProducts } from '../../services/api';

export default function RelatedProducts({ categorySlug }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) return;

    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchRelatedProducts(categorySlug);
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, [categorySlug]);

  if (loading) return null;
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-16 md:mt-20">
      <h3 className="font-rubik text-[28px] lg:text-[32px] font-bold text-dark mb-8">
        Related Products
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
          className="product-slider"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="pb-4">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
