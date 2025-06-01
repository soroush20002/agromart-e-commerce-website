'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const cards = [
  {
    title: 'پشتیبانی',
    subtitle: 'تلفنی و داخل اکثر پلتفرم ها',
    subtitleColor: 'text-indigo-600',
    desc: 'اینستاگرام،تلگرام،واتساپ',
    icon: '/5bcc95f9cdf00213b439f627ec85fc92.png',
    iconAlt: 'پشتیبانی',
  },
  {
    title: 'ارسال به سراسر کشور',
    subtitle: 'پیک برای رشت و پست برای کل ایران',
    subtitleColor: 'text-blue-600',
    desc: 'روش های ارسال متنوع',
    icon: '/1d5a20af971dd9719410b8ff8005c795.png',
    iconAlt: 'ارسال',
  },
  {
    title: 'درگاه پرداخت',
    subtitle: 'پرداخت ایمن',
    subtitleColor: 'text-blue-500',
    desc: 'با درگاه های معتبر',
    icon: '/0f523d09ecb539962b3f0443c84d92a3.png',
    iconAlt: 'پرداخت',
  },
  {
    title: 'ضمانت کیفیت محصول',
    subtitle: 'خرید مطمئن بدون نگرانی از کیفیت',
    subtitleColor: 'text-yellow-600',
    desc: '',
    icon: '/a66516e4be572786cf51010e7e094160.png',
    iconAlt: 'کیفیت',
  },
];

const Why = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils
      .toArray('.why-card')
      .forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 80,
          duration: 1.1,
          delay: i * 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            toggleActions: "play reverse play reverse",
            markers: false,
            onEnter: () => {
              gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 1.1,
                delay: i * 0.25,
                ease: "elastic.out(1,0.3)",
              });
            },
            onLeaveBack: () => {
              gsap.from(card, {
                opacity: 0,
                y: 80,
                duration: 1.1,
                ease: "elastic.out(1,0.3)",
              });
            }
          },
        });
      });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-2 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="why-card flex flex-col items-center justify-between border border-gray-200 rounded-2xl bg-white/60 backdrop-blur-md shadow-sm p-6 min-h-[260px]  hover:shadow-lg"
          >
            <div className="w-full flex-1 flex flex-col items-center justify-center">
              <h3 className="font-bold text-lg md:text-xl text-center mb-2 text-gray-900">{card.title}</h3>
              <div className={`text-base md:text-lg font-bold mb-1 text-center ${card.subtitleColor}`}>{card.subtitle}</div>
              <div className="text-gray-600 text-sm md:text-base text-center mb-2">{card.desc}</div>
            </div>
            <img
              src={card.icon}
              alt=""
              className="w-16 h-16 mt-4 object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Why; 