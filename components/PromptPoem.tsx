import React from 'react';
import { PoemsType } from '@/types';

type children = {
  poem: PoemsType;
};

export default function PromptPoem({ poem }: children) {
  return (
    <div className='flex flex-wrap'>
      {poem.map((poem) => (
        <span key={poem.id}>
          <small className='text-default-500'>{poem.author}</small>
          <h4 className='font-bold text-large'>{poem.name}</h4>
          <br></br>
          <p className='md:overflow-y-scroll md:h-48'>
            {poem.content.split('\n\n').map((stanza, index) => (
              <React.Fragment key={index}>
                {stanza.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
                <br />
              </React.Fragment>
            ))}
          </p>
          <br></br>
        </span>
      ))}
    </div>
  );
}
