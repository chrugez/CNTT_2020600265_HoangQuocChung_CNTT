import { memo } from "react"
import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import path from "../../ultils/path";

const banner1 = {
  category: 'Accessories',
  id: '660a60864a6c9de580552676',
  title: 'MOTOROLA MOTO 360 (2ND GEN)'
}

const banner2 = {
  category: 'Tablet',
  id: '660a60864a6c9de580552653',
  title: 'APPLE IPAD PRO'
}

const Banner = () => {
  const navigate = useNavigate()

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };
  return (
    <div className="w-full">
      <Slider {...settings} >
        <div className="w-full border border-black">
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/slideshow3-home2_1920x.jpg?v=1613166679"
            alt="banner"
            className="w-full h-[481px] "
          />
        </div>
        <div className="w-full border border-black cursor-pointer"
          onClick={() => navigate(`/${banner1.category}/${banner1.id}/${banner1.title}`)}
        >
          <img
            src="https://digital-world-store.myshopify.com/cdn/shop/files/moto-360-2nd-gen-official_800x.png?v=1613565244"
            alt="banner"
            className="w-full h-[481px] "
          />
        </div>
        <div className="w-full border border-black cursor-pointer"
          onClick={() => navigate(`/${banner2.category}/${banner2.id}/${banner2.title}`)}
        >
          <img
            src="https://file.hstatic.net/1000347078/collection/ipad-pro-float-ad-banner_copy_fd45ecc6b42d4e0981f08bef57ec3e5e.jpg"
            alt="banner"
            className="w-full h-[481px] "
          />
        </div>
        {/* <div>
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/slideshow3-home2_1920x.jpg?v=1613166679"
            alt="banner"
            className="w-full h-[481px] "
          />
        </div>
        <div>
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/slideshow3-home2_1920x.jpg?v=1613166679"
            alt="banner"
            className="w-full h-[481px] "
          />
        </div>
        <div>
          <img
            src="https://digital-world-2.myshopify.com/cdn/shop/files/slideshow3-home2_1920x.jpg?v=1613166679"
            alt="banner"
            className="w-full h-[481px] "
          />
        </div> */}
      </Slider>
    </div>
  )
}

export default memo(Banner)