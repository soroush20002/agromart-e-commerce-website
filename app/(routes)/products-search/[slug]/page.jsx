import ProductSearchPage from './_components/Product';
import GlobalApi from '@/app/_utils/GlobalApi';

export async function generateMetadata(props) {
  const { params } = await props; 
  const slug = decodeURIComponent(params?.slug || "");
  const product = await GlobalApi.getProductBySlug(slug).then((res) => res?.[0] || null);

  if (!product) {
    return {
      title: "محصول یافت نشد",
      description: "محصول مورد نظر در فروشگاه موجود نیست.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

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


export default async function Page(props) {
  const params = await props.params; 
  const slug = decodeURIComponent(params?.slug || "");
  return <ProductSearchPage slug={slug} />;
}
