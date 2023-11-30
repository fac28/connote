// ResponseItem.tsx
import React from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa6';
import { topThreeTextColours } from '@/utils/responsePageHandling/addingHighlightAttribute';
import { ResponsesType } from '@/types';

type ResponseItemProps = {
  response: ResponsesType[number];
  index: number;
  hearts: { [key: number]: number };
  likedResponses: { [key: number]: boolean };
  handleHeartsClick: (responseId: number, userId: string) => Promise<void>;
  loadingHearts: boolean;
};

const ResponseItem: React.FC<ResponseItemProps> = ({
  response,
  index,
  hearts,
  likedResponses,
  handleHeartsClick,
  loadingHearts,
}) => {
  return (
    <div className='bg-connote_white p-4 mt-4 rounded-md flex justify-between shadow-inner responseComment'>
      <div className='flex flex-col'>
        <h2
          className={`${
            topThreeTextColours[index]
              ? topThreeTextColours[index]
              : 'text-connote_dark'
          } responseUser  text-md`}
        >
          @{response.user?.username}
        </h2>

        <p className='text-connote_dark'>{response.response_written}</p>
      </div>
      <br />
      <div className='flex items-center flex-col '>
        {likedResponses[response.id] ? (
          <FaHeart
            className='text-red-500 hover:cursor-pointer'
            onClick={() => handleHeartsClick(response.id, response.user_id)}
          />
        ) : (
          <FaRegHeart
            className='hover:cursor-pointer'
            onClick={() => handleHeartsClick(response.id, response.user_id)}
          />
        )}

        <span className='text-connote_dark text-tiny'>
          {loadingHearts ? 'Loading...' : hearts[response.id] || 0}
        </span>
      </div>
    </div>
  );
};

export default ResponseItem;
