// components/GlideCarousel.tsx
'use client';
import React, { useEffect } from 'react';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';

type children = {
  prompts: PromptsType;
};

type PromptsType =
  | Array<{
      id: number;
      initial_prompt: string;
      follow_up_prompt: string;
      highlighting_format: string;
    }>
  | [];

const Carousel = ({ prompts }: children) => {
  useEffect(() => {
    new Glide('.glide', {
      type: 'carousel',
    }).mount();
  }, []);

  return (
    <div className='glide'>
      <div className='glide__track' data-glide-el='track'>
        <ul className='glide__slides'>
          {prompts.map((prompt) => (
            <li key={prompt.id} className='glide__slide'>
              <p>Prompt: {prompt.id}</p>
              <p>initialprompt: {prompt.initial_prompt}</p>
              <p>followupprompt: {prompt.follow_up_prompt}</p>
              <p>highlightingformat: {prompt.highlighting_format}</p>
              <br></br>
            </li>
          ))}
        </ul>
      </div>
      <div className='glide__arrows bg-white' data-glide-el='controls'>
        <button className='glide__arrow glide__arrow--left' data-glide-dir='<'>
          previous
        </button>
        <button className='glide__arrow glide__arrow--right' data-glide-dir='>'>
          next
        </button>
      </div>
    </div>
  );
};

export default Carousel;
