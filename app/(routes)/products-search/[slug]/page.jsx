import ProductSearchPage from './_components/Product';
import GlobalApi from '@/app/_utils/GlobalApi';

export async function generateMetadata({ params = {} }) {
  const slug = decodeURIComponent(params?.slug || "");
  const product = await GlobalApi.getProductBySlug(slug).then((res) => res?.[0] || null);

  const title = product?.namefa;
  const description = product?.description
    ? product.description.slice(0, 150)
    : "مشاهده مشخصات محصول";

  return {
    title: `خرید ${title}`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `https://agrm.ir/products-search/${slug}`,
      siteName: 'فروشگاه کشاورزی غفوری',
      locale: 'fa_IR',
      type: 'website',
    },
  };
}

export default function Page() {
  return <ProductSearchPage />;
}
