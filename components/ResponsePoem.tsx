// import React from 'react';
// import { PoemsType } from '@/types';

// type children = {
//   poem: PoemsType;
// };

// export default function ResponsePoem({ poem }: children) {
//   return (
//     <div className='flex flex-wrap'>
//       {poem.map((poem) => (
//         <span key={poem.id}>
//           <p>id: {poem.id}</p>
//           <small className='text-default-500'>{poem.author}</small>
//           <h4 className='font-bold text-large'>{poem.name}</h4>
//           <br></br>
//           <p className='md:overflow-y-scroll md:h-48'>
//             {poem.content.split('\n\n').map((stanza, index) => (
//               <React.Fragment key={index}>
//                 {stanza.split('\n').map((line, lineIndex) => (
//                   <React.Fragment key={lineIndex}>
//                     {line}
//                     <br />
//                   </React.Fragment>
//                 ))}
//                 <br />
//               </React.Fragment>
//             ))}
//           </p>{' '}
//           <br></br>
//         </span>
//       ))}
//     </div>
//   );
// }

// export default function ResponsePoem({ poem }: children) {
//   let wordCounter = 0;
//   return (
//     <div className='flex flex-wrap'>
//       {poem.map((poem) => (
//         <span key={poem.id}>
//           <p>id: {poem.id}</p>
//           <p>author: {poem.author}</p>
//           <p>name: {poem.name}</p>
//           <br />
//           <p>
//             {poem.content.split('\n\n').map((stanza, index) => (
//               <React.Fragment key={index}>
//                 {stanza.split('\n').map((line, lineIndex) => (
//                   <React.Fragment key={lineIndex}>
//                     {line.split(' ').map((word, wordIndex) => (
//                       <React.Fragment key={wordCounter++}>
//                         <span
//                           id={String(wordCounter)}
//                           // onClick={(event) =>
//                           //   oneWordHighlightingFunction(event, word)
//                           // }
//                         >
//                           {word}
//                         </span>{' '}
//                       </React.Fragment>
//                     ))}
//                     <br />
//                   </React.Fragment>
//                 ))}
//                 <br />
//               </React.Fragment>
//             ))}
//           </p>
//           <br />
//         </span>
//       ))}
//     </div>
//   );
// }

import React from 'react';
import { PoemsType, ResponsesType } from '@/types';

type ResponsePoemProps = {
  poem: PoemsType;
  responses: ResponsesType;
};

export default function ResponsePoem({ poem, responses }: ResponsePoemProps) {
  let wordCounter = 0;
  return (
    <div className='flex flex-wrap'>
      {poem.map((poemItem) => (
        <span key={poemItem.id}>
          <p>id: {poemItem.id}</p>
          <p>author: {poemItem.author}</p>
          <p>name: {poemItem.name}</p>
          <br />
          <p>
            {poemItem.content.split('\n\n').map((stanza, index) => (
              <React.Fragment key={index}>
                {stanza.split('\n').map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line.split(' ').map((word, wordIndex) => {
                      const currentWordIndex = wordCounter++;
                      const isSelected = responses.some((response) =>
                        response.response_selected.includes(currentWordIndex)
                      );

                      return (
                        <React.Fragment key={currentWordIndex}>
                          <span
                            id={String(currentWordIndex)}
                            className={isSelected ? 'bg-connote_orange' : ''}
                          >
                            {word}
                          </span>{' '}
                        </React.Fragment>
                      );
                    })}
                    <br />
                  </React.Fragment>
                ))}
                <br />
              </React.Fragment>
            ))}
          </p>
          <br />
        </span>
      ))}
    </div>
  );
}
