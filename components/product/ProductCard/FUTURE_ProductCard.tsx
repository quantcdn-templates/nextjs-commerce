import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import s from './ProductCard.module.css'
import Image, { ImageProps } from 'next/image'
import WishlistButton from '@components/wishlist/WishlistButton'

interface Props {
  className?: string
  product: Product
  variant?: 'slim' | 'simple'
  imgProps?: Omit<ImageProps, 'src'>
}

const ProductCard: FC<Props> = ({ className, product, variant, imgProps }) => {
  return (
    <Link href={`product/${product.slug}`}>
      <a
        className={cn(s.root, { [s.simple]: variant === 'simple' }, className)}
      >
        {variant === 'slim' ? (
          <div className="relative overflow-hidden box-border">
            <div className="absolute inset-0 flex items-center justify-end mr-8 z-20">
              <span className="bg-black text-white inline-block p-3 font-bold text-xl break-words">
                {product.name}
              </span>
            </div>
            {product.images[0] && (
              <Image
                quality="85"
                alt={product.name}
                src={product.images[0].url}
                height={320}
                width={320}
                layout="fixed"
                {...imgProps}
              />
            )}
          </div>
        ) : (
          <>
            <div className={s.squareBg} />
            <div className="flex flex-row justify-between box-border w-full z-20 absolute">
              <div className="absolute top-0 left-0 pr-16 max-w-full">
                <h3 className={s.productTitle}>
                  <span>{product.name}</span>
                </h3>
                <span className={s.productPrice}>
                  {product.prices[0].value}
                  &nbsp;
                  {product.prices[0].currencyCode}
                </span>
              </div>
              <WishlistButton
                className={s.wishlistButton}
                productId={product.id}
                variant={product.variants[0]!}
              />
            </div>
            <div className={s.imageContainer}>
              {product.images[0] && (
                <Image
                  alt={product.name}
                  className={s.productImage}
                  src={product.images[0].url}
                  height={540}
                  width={540}
                  quality="85"
                  layout="responsive"
                  {...imgProps}
                />
              )}
            </div>
          </>
        )}
      </a>
    </Link>
  )
}

export default ProductCard