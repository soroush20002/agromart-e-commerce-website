import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Slider from "./_components/Slider";
import GlobalApi from "./_utils/GlobalApi";
import Footer from "./_components/Footer";
import Why from "./_components/Why";
export const revalidate = 60;

export default async function Home() {
  const sliderList=await GlobalApi.getSliders();
  const categoryList=await GlobalApi.getCategoryList();
  const productList=await GlobalApi.getAllProducts();

  return (
    <main className="min-h-screen w-full">
      <div className="pl-2 md:pl-10 pr-2 md:pr-10 pt-0 lg:pt-9 md:pt-0 w-full">
        <div className="relative">
          <Slider sliderList={sliderList} />
          <CategoryList categoryList={categoryList} />
          <h2 className='font-bold text-green-600  flex justify-center b text-2xl text-right mt-10 '> برخی از محصولات </h2>
          <ProductList productList={productList} />
          <h2 className='font-bold text-green-600  flex justify-center b text-2xl text-right mt-10 '> چرا ما؟ </h2>
          <Why/>
        </div>
      </div>
    </main>
  );
} 
