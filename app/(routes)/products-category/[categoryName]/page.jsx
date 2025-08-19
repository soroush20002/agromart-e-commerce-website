import GlobalApi from '@/app/_utils/GlobalApi';
import React from 'react';
import TopCategoryList from './_components/TopCategoryList';
import ProductList from '@/app/_components/ProductList';

export async function generateMetadata({ params }) {
    const categoryName = decodeURIComponent(params.categoryName || "").toLowerCase();
    const categoryList = await GlobalApi.getCategoryList();
    const category = categoryList.find(cat => cat.name.toLowerCase() === categoryName);
    const categoryFaName = category ? category.namefa : categoryName;
  
    const title = categoryFaName;
    const description = `مشاهده و خرید آنلاین محصولات مربوط به دسته "${categoryFaName}" در فروشگاه غفوری. ارسال سریع به سراسر ایران`;
    return {
      title,
      description,
      robots: {
        index: true,
        follow: true,
      },
      openGraph: {
        title,
        description,
        url: `https://agrm.ir/products-category/${categoryName}`,
        siteName: 'فروشگاه کشاورزی غفوری',
        locale: 'fa_IR',
        type: 'website',
      },
    };
  }
  
async function ProductCategory({ params }) {
    try {
        const categoryName = decodeURIComponent(params.categoryName || "").toLowerCase();
        console.log("Fetching products for category:", categoryName);

        const [productList, categoryList] = await Promise.all([
            GlobalApi.getProductsByCategory(categoryName),
            GlobalApi.getCategoryList()
        ]);

        const category = categoryList.find(cat => cat.name.toLowerCase() === categoryName);
        const categoryFaName = category ? category.namefa : categoryName; 
 
        return (
            <div>
                <h1 className="p-4 bg-green-700 text-white font-bold text-3xl text-center">
                    {categoryFaName}
                </h1>
                <TopCategoryList categoryList={categoryList} selectedCategory={categoryName} />
                <div className="p-2 md:p-5">
                    <ProductList productList={productList} slicenum={10000} />
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error:", error);
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold text-red-500">Something went wrong!</h2>
            </div>
        );
    }
}

export default ProductCategory;
