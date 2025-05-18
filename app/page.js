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
    <div className="pl-2 md:pl-10 pr-2 md:pr-10 pt-0 lg:pt-9 md:pt-0  ">
      <Slider sliderList={sliderList} />
      <CategoryList categoryList={categoryList} />
      <ProductList productList={productList} />
      <Why/>
    </div>
  );
} 
