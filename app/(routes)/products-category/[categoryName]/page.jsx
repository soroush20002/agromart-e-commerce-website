import GlobalApi from '@/app/_utils/GlobalApi';
import React from 'react';
import TopCategoryList from './_components/TopCategoryList';
import ProductList from '@/app/_components/ProductList';

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
                <h2 className="p-4 bg-green-700 text-white font-bold text-3xl text-center">
                    {categoryFaName}
                </h2>
                <TopCategoryList categoryList={categoryList} selectedCategory={categoryName} />
                <div className="p-5 md:p-10">
                    <ProductList productList={productList} />
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
