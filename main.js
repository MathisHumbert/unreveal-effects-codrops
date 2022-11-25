import './style.css';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import imagesLoaded from 'imagesloaded';

gsap.registerPlugin(Flip);

let winsize = { width: window.innerWidth, height: window.innerHeight };
let inPreview = false;
let isAnimating = false;

const contentItem = document.querySelectorAll('.content__item');
const contentImgWrapper = document.querySelectorAll(
  '.content__item__img__wrapper'
);
const contentTitleContainer = document.querySelectorAll(
  '.content__item__title'
);
const contentTitle = document.querySelectorAll(
  '.content__item__title .oh__inner'
);
const contentImg = document.querySelectorAll('.content__item__img');
const contentCaption = document.querySelectorAll('.content__item__caption');
const contentOverlay = document.querySelector('.content__overlay');

const previewItem = document.querySelectorAll('.preview__item');
const previewBack = document.querySelector('.preview__back');
const previewTitle = document.querySelectorAll(
  '.preview__item__title .oh__inner'
);
const previewSubtitle = document.querySelectorAll(
  '.preview__item__subtitle .oh__inner'
);
const previewMeta = document.querySelectorAll(
  '.preview__item__meta .oh__inner'
);
const previewBoxLeftTitle = document.querySelectorAll(
  '.preview__item__box--left .preview__item__box__title .oh__inner'
);
const previewBoxLeftDescription = document.querySelectorAll(
  '.preview__item__box--left .preview__item__box__description'
);
const previewBoxRightTitle = document.querySelectorAll(
  '.preview__item__box--right .preview__item__box__title .oh__inner'
);
const previewBoxRightDescription = document.querySelectorAll(
  '.preview__item__box--right .preview__item__box__description'
);
const previewImgOuter = document.querySelectorAll('.preview__item__img__outer');

const init = () => {
  const imgLoaded = imagesLoaded(contentImg, { background: true });

  console.log(imgLoaded.images.length);
  imgLoaded.on('done', () => {
    // document.body.classList.remove('loading');
  });
};

init();

const onMouseClick = (index) => {
  if (inPreview || isAnimating) return;

  isAnimating = true;

  const { x: contentOverlayX } = contentItem[index].getBoundingClientRect();
  const contentOverlayOrigin = index % 2 ? '0% 100%' : '0% 0%';

  const tl = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: 'power4.inOut',
    },
    onStart: () => {
      inPreview = true;
      gsap.set(contentItem[index], { zIndex: 10 });
      gsap.set(contentOverlay, {
        transformOrigin: contentOverlayOrigin,
        scaleX: contentItem[index].offsetWidth / winsize.width,
        x: contentOverlayX,
      });
      gsap.set(
        [
          previewTitle[index],
          previewSubtitle[index],
          previewMeta[index],
          previewBoxLeftTitle[index],
          previewBoxRightTitle[index],
        ],
        {
          yPercent: 100,
        }
      );
      gsap.set(
        [previewBoxLeftDescription[index], previewBoxRightDescription[index]],
        { yPercent: 15, opacity: 0 }
      );

      previewItem[index].classList.add('preview__item--current');
      document.body.classList.add('preview-open');
    },
    onComplete: () => (isAnimating = false),
  });

  tl.addLabel('start')
    .addLabel('content', 'start+=0.6')
    .to(
      contentTitle[index],
      {
        yPercent: index % 2 ? -100 : 100,
      },
      0
    )
    .to(
      contentCaption[index],
      {
        yPercent: index % 2 ? -10 : 10,
        opacity: 0,
      },
      0
    )
    .to(
      contentOverlay,
      {
        scaleY: 1,
      },
      0
    )
    .to(
      contentOverlay,
      {
        scaleX: 1,
        x: 0,
      },
      'content'
    )
    .add(() => {
      const flip = Flip.getState(contentImgWrapper[index]);
      previewImgOuter[index].appendChild(contentImgWrapper[index]);
      Flip.from(flip, {
        duration: 0.8,
        ease: 'power4.inOut',
        absolute: true,
      });
    }, 'content')
    .to(
      [
        previewTitle[index],
        previewSubtitle[index],
        previewMeta[index],
        previewBoxLeftTitle[index],
        previewBoxRightTitle[index],
      ],
      { duration: 1.1, ease: 'expo', yPercent: 0 },
      'content+=0.3'
    )
    .to(
      [previewBoxLeftDescription[index], previewBoxRightDescription[index]],
      { duration: 1.1, ease: 'expo', yPercent: 0, opacity: 1 },
      'content+=0.3'
    )
    .to(previewBack, { opacity: 1 }, 'content');
};

const onMouseEnter = (index) => {
  if (inPreview) return;

  const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power4' } });

  tl.addLabel('start', 0)
    .set(contentTitle[index], { transformOrigin: '0% 50%' }, 0)
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
  if (inPreview) return;

  gsap.to([contentImgWrapper[index], contentImg[index]], {
    scale: 1,
    duration: 0.8,
    ease: 'power4',
  });
};

const onButtonClick = () => {
  if (isAnimating) return;
  isAnimating = true;

  const previewInView = document.querySelector('.preview__item--current');
  const index = +previewInView.getAttribute('data-id');

  const { x: contentOverlayX } = contentItem[index].getBoundingClientRect();

  const tl = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: 'power4.inOut',
    },
    onComplete: () => {
      previewInView.className = 'preview__item';
      document.body.classList.remove('preview-open');
      isAnimating = false;
      inPreview = false;
      gsap.set(contentItem[index], { zIndex: 1 });
    },
  });

  tl.addLabel('start', 0)
    .addLabel('content', 'start+=0.6')
    .to(
      [
        previewTitle[index],
        previewSubtitle[index],
        previewMeta[index],
        previewBoxLeftTitle[index],
        previewBoxRightTitle[index],
      ],
      {
        yPercent: 100,
        ease: 'power2',
      },
      0
    )
    .to(
      [previewBoxLeftDescription[index], previewBoxRightDescription[index]],
      { yPercent: 15, opacity: 0 },
      0
    )
    .to(previewBack, { opacity: 0, ease: 'power2' }, 0)
    .add(() => {
      const flip = Flip.getState(contentImgWrapper[index]);
      contentTitleContainer[index].after(contentImgWrapper[index]);
      Flip.from(flip, {
        duration: 0.8,
        ease: 'power4.inOut',
        absolute: true,
      });
    }, 0)
    .to(
      contentOverlay,
      {
        scaleX: contentItem[index].offsetWidth / winsize.width,
        x: contentOverlayX,
      },
      0
    )
    .to(
      contentOverlay,
      {
        scaleY: 0,
      },
      'content'
    )
    .to(
      contentTitle[index],
      {
        yPercent: 0,
      },
      'content'
    )
    .to(
      contentCaption[index],
      {
        yPercent: 0,
        opacity: 1,
      },
      'content'
    );
};

contentImgWrapper.forEach((content, index) => {
  content.addEventListener('click', () => onMouseClick(index));

  content.addEventListener('mouseenter', () => onMouseEnter(index));

  content.addEventListener('mouseleave', () => onMouseLeave(index));
});

previewBack.addEventListener('click', onButtonClick);

window.addEventListener('resize', () => {
  winsize = { width: window.innerWidth, height: window.innerHeight };
});
