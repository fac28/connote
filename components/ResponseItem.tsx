import React, { Dispatch, SetStateAction } from 'react';
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
  clickedCommentWords: number[];
  setClickedCommentWords: Dispatch<SetStateAction<number[]>>;
};

const ResponseItem: React.FC<ResponseItemProps> = ({
  response,
  index,
  hearts,
  likedResponses,
  handleHeartsClick,
  loadingHearts,
  clickedCommentWords,
  setClickedCommentWords,
}) => {
  function highlightCommentWords() {
    // Check if any element in response.response_selected is already highlighted
    const isHighlighted = response.response_selected.some((id) =>
      clickedCommentWords.includes(id)
    );

    // If highlighted, remove from the list; otherwise, add to the list
    const updatedClickedCommentWords = isHighlighted
      ? clickedCommentWords.filter(
          (id) => !response.response_selected.includes(id)
        )
      : [...clickedCommentWords, ...response.response_selected];

    // Add a reference to the comment div
    const commentDiv = document.getElementById(`response-${response.id}`);

    // Check if the comment div exists
    if (commentDiv) {
      // Toggle the black border on click
      commentDiv.style.border = isHighlighted ? '' : '2px solid black';
    }

    setClickedCommentWords(updatedClickedCommentWords);
  }

  return (
    <div
      id={`response-${response.id}`}
      className='bg-connote_white p-4 mt-4 rounded-md w-64 flex justify-between shadow-inner responseComment'
    >
      {' '}
      <div
        className='flex flex-col hover:cursor-pointer'
        onClick={highlightCommentWords}
      >
        <h2
          className={`  ${
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
