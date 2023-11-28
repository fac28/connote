import React from 'react';
import { PoemsType } from '@/types';

type children = {
  poem: PoemsType;
};

export default function ResponsePoem({ poem }: children) {
  return (
    <div className='flex flex-wrap'>
      {poem.map((poem) => (
        <span key={poem.id}>
          <p>id: {poem.id}</p>
          <small className='text-default-500'>{poem.author}</small>
          <h4 className='font-bold text-large'>{poem.name}</h4>
          <br></br>
          <p className='poemScrollOverflow'>
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
          </p>{' '}
          <br></br>
        </span>
      ))}
    </div>
  );
}
