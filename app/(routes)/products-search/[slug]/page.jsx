import ProductSearchPage from './_components/Product';
import GlobalApi from '@/app/_utils/GlobalApi';

export async function generateMetadata({ params }) {
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

  const title = product?.namefa || "محصول";
  const description = product?.description
    ? product.description.slice(0, 150)
    : "مشاهده مشخصات محصول";

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const imagePath = product?.images?.[0]?.url || "";
  const imageUrl = `${baseUrl}${imagePath}`;

  return {
    title: `خرید ${title} | فروشگاه کشاورزی غفوری`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `خرید ${title}`,
      description,
      url: `https://agrm.ir/products-search/${slug}`,
      siteName: "فروشگاه کشاورزی غفوری",
      locale: "fa_IR",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: product?.images?.[0]?.width || 800,
          height: product?.images?.[0]?.height || 800,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `خرید ${title}`,
      description,
      images: [imageUrl],
    },
  };
}


export default async function Page(props) {
  const params = await props.params; 
  const slug = decodeURIComponent(params?.slug || "");
  return <ProductSearchPage slug={slug} />;
}
