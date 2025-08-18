import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Slider from "./_components/Slider";
import GlobalApi from "./_utils/GlobalApi";
import Footer from "./_components/Footer";
import Why from "./_components/Why";
import ForThisSession from "./_components/ForThisSession"
export const revalidate = 60;

export const metadata = {
  title: 'فروشگاه کشاورزی غفوری | خرید آنلاین تجهیزات کشاورزی',
  description: 'خرید اینترنتی انواع ابزار و لوازم کشاورزی با بهترین قیمت از فروشگاه غفوری. ارسال به سراسر ایران با پشتیبانی رایگان.',
  keywords: ['فروشگاه کشاورزی', 'ابزار کشاورزی', 'خرید لوازم باغبانی', 'غفوری'],
  openGraph: {
    title: 'فروشگاه کشاورزی غفوری',
    description: 'بهترین فروشگاه اینترنتی برای خرید لوازم کشاورزی و باغبانی در ایران',
    url: 'https://agrm.ir',
    siteName: 'فروشگاه غفوری',
    locale: 'fa_IR',
    type: 'website',
  },
};

export default async function Home() {
  const sliderList=await GlobalApi.getSliders();
  const categoryList=await GlobalApi.getCategoryList();
  const productList=await GlobalApi.getvitrin();
  const sproductList=await GlobalApi.getForThisSession();


  return (
    <main className="min-h-screen w-full">
      <div className="pl-2 md:pl-10 pr-2 md:pr-10 pt-0 lg:pt-9 md:pt-0 w-full">
        <div className="relative">
          <Slider sliderList={sliderList} />
          <CategoryList categoryList={categoryList} />
          <div className="max-h-[100px]">
            <div className="font-bold text-green-600  flex justify-center b text-2xl rounded-r-4xl border-t-2 pt-0 h-9 border-t-emerald-950 text-right mt-0 translate-y-[53px] w-[calc(50%-92px)] ml-auto"/>
            <h2 className='font-bold text-green-600  flex justify-center b text-2xl rounded-2xl pt-0 text-right mt-0 '> برخی از محصول ها </h2>
            <div className="font-bold text-green-600  flex justify-center b text-2xl rounded-l-4xl border-t-2 pt-0 h-9 border-t-emerald-950 text-right mt-0 -translate-y-[16px] w-[calc(50%-92px)] "/>
          </div>
          <ProductList productList={productList} slicenum={10} />
          <div className="max-h-[110px]" >
            <div className="font-bold text-green-600  flex justify-center b text-2xl rounded-r-4xl border-t-2 pt-2 h-9 border-t-emerald-950 text-right mt-1 translate-y-[61px] w-[calc(50%-70px)] ml-auto"/>
            {sproductList.length > 0 ? (<h2 className='font-bold text-green-600  flex justify-center b text-2xl text-right mt-0 rounded-2xl pt-2'> برای این فصل </h2>) : (null)}
            <div className="font-bold text-green-600  flex justify-center b text-2xl rounded-l-4xl border-t-2 pt-2 h-9 border-t-emerald-950 text-right mt-1 -translate-y-[19px] w-[calc(50%-70px)] "/>
          </div>
          <ForThisSession productList={sproductList} slicenum={10} />
          <div className="max-h-[60px]" >
            <div className="font-bold text-green-600  flex justify-center b text-2xl rounded-r-4xl border-t-2 pt-2 h-9 border-t-emerald-950 text-right mt-1 translate-y-[61px] w-[calc(50%-70px)] ml-auto"/>
            <h2 className='font-bold text-green-600  flex justify-center b text-2xl text-right mt-2 rounded-2xl'> چرا ما؟ </h2>
            <div className="font-bold text-green-600  flex justify-center b text-2xl rounded-l-4xl border-t-2 pt-2 h-9 border-t-emerald-950 text-right mt-1 -translate-y-[19px] w-[calc(50%-70px)] "/>
          </div>
          <Why/>
        </div>
      </div>
    </main>
  );
} 
