import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { categoryAPI, productAPI } from '../services/api';
import { useWishlist } from '../contexts/WishlistContext';
import { useNotification } from '../contexts/NotificationContext';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories
        const categoriesResponse = await categoryAPI.getAll();
        setCategories(categoriesResponse.data || []);

        // Fetch hot/best selling products
        const hotProductsResponse = await productAPI.getHot();
        setHotProducts(hotProductsResponse.data || []);

        // Fetch all products for new arrivals
        const allProductsResponse = await productAPI.getAll();
        const allProducts = allProductsResponse.data || [];
        
        // Get newest products (sort by createdAt, most recent first)
        const sortedProducts = [...allProducts].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNewArrivals(sortedProducts.slice(0, 8));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center relative">
          {/* Animated background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8B7355]/5 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Loading spinner */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#8B7355] rounded-full animate-spin"></div>
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Products</h3>
          <p className="text-gray-600 mb-4">Please wait while we prepare everything for you...</p>
          
          {/* Loading dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fadeIn">
      {/* Hero Carousel */}
      <HeroCarousel />

{/* Shop by Categories - Horizontal Scroll */}
<section className="py-12 md:py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="mb-8 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Shop by Categories
      </h2>
      <p className="text-gray-600">Browse our collections</p>
    </div>

    <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-hide justify-center">
      {categories.map((category) => (
        <Link
          key={category._id}
          to={`/category/${category.slug}`}
          className="flex-shrink-0 group text-center"
        >
          <div className="relative w-24 h-24 md:w-40 md:h-40 rounded-full mb-3 mx-auto">
            {/* Ring container */}
            <div className="absolute inset-0 rounded-full ring-2 ring-gray-300 group-hover:ring-4 group-hover:ring-[#8B7355] group-hover:shadow-lg transition-all duration-300 z-10 pointer-events-none"></div>
            
            {/* Image container */}
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <p className="text-gray-900 text-sm md:text-base font-semibold group-hover:text-[#8B7355] transition-colors duration-300">{category.name}</p>
        </Link>
      ))}
    </div>
  </div>
</section>


      {/* Best Selling Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Best Selling
            </h2>
            <p className="text-gray-600">Top picks from our store</p>
          </div>

          {hotProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {hotProducts.slice(0, 10).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-lg">No best selling products available at the moment</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for our top picks!</p>
            </div>
          )}
        </div>
      </section>

     
      {/* New Arrivals */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 ">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              New Arrivals
            </h2>
            <p className="text-gray-600">Check out our latest products</p>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-lg">No new arrivals available at the moment</p>
              <p className="text-gray-500 text-sm mt-2">Stay tuned for exciting new products!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
