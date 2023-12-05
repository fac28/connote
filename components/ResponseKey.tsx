import { ReactElement } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/react';
import { FaCircleQuestion } from 'react-icons/fa6';
export default function ResponseKey(): ReactElement {
  return (
    <div>
      <Accordion variant='light'>
        <AccordionItem
          key='1'
          aria-label='Key'
          startContent={<FaCircleQuestion />}
          title='Key'
          className=''
        >
          <div className='flex  bg-connote_pastel_purple p-2 bg-opacity-30 rounded-md shadow-md'>
            <div className='flex flex-col'>
              <div>
                <p className='text-xs'> Top 3 likes</p>
              </div>
              <div className='flex'>
                <p className='py-0.5 px-1.5  text-xs  bg-connote_orange rounded-md shadow-lg m-0.5'>
                  First
                </p>
                <p className='py-0.5 px-1.5 text-xs  bg-connote_green rounded-md shadow-lg m-0.5'>
                  Second
                </p>
                <p className='py-0.5 px-1.5 text-xs  bg-connote_pastel_blue rounded-md shadow-lg m-0.5'>
                  Third
                </p>
              </div>
            </div>
            <div className='px-3'>
              <div>
                <p className='text-xs'>Your selection</p>
              </div>
              <div>
                <p className='py-0.5  text-xs px-1.5 rounded-md shadow-lg m-0.5 border-2 border-primary'>
                  Selected word
                </p>
              </div>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
