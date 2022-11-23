import './style.css';
import gsap from 'gsap';

const initContentHover = () => {
  const contentImgWrapper = document.querySelectorAll(
    '.content__item__img__wrapper'
  );
  const contentTitle = document.querySelectorAll(
    '.content__item__title .oh__inner'
  );
  const contentImg = document.querySelectorAll('.content__item__img');

  const onMouseEnter = (index) => {
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power4' } });

    tl.addLabel('start', 0)
      .set(contentTitle[index], { transformOrigin: '0 50%' }, 0)
      .to(
        contentTitle[index],
        {
          startAt: { filter: 'blur(0px)' },
          duration: 0.2,
          ease: 'power1.in',
          yPercent: -100,
          rotation: -4,
          filter: 'blur(6px)',
        },
        0
      )
      .to(
        contentTitle[index],
        {
          startAt: { yPercent: 100, rotation: 4, filter: 'blur(6px)' },
          yPercent: 0,
          rotation: 0,
          filter: 'blur(0px)',
        },
        'start+=0.2'
      )
      .to(contentImgWrapper[index], { scale: 0.95 }, 0)
      .to(contentImg[index], { scale: 1.2 }, 0);
  };

  const onMouseLeave = (index) => {
    gsap.to([contentImgWrapper[index], contentImg[index]], {
      scale: 1,
      duration: 0.8,
      ease: 'power4',
    });
  };

  contentImgWrapper.forEach((content, index) => {
    content.addEventListener('mouseenter', () => onMouseEnter(index));

    content.addEventListener('mouseleave', () => onMouseLeave(index));
  });
};

const init = () => {
  initContentHover();
};

window.addEventListener('load', () => init());
