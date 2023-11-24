import { Card, CardHeader, CardBody, Image } from '@nextui-org/react';

type children = {
  poemDate: string;
  poemAuthor: string;
  poemName: string;
  poemImage: string;
};

export default function PoemCard({
  poemDate,
  poemAuthor,
  poemName,
  poemImage,
}: children) {
  return (
    <Card className='p-3 m-3 w-64 h-64 aspect-w-1 cursor-pointer'>
      <CardHeader className='pt-2 px-4 flex-col items-start'>
        <p className='text-tiny uppercase font-bold'>{poemDate}</p>
        <small className='text-default-500'>{poemAuthor}</small>
        <h4 className='font-bold text-large'>{poemName}</h4>
      </CardHeader>
      <CardBody className='overflow-hidden relative rounded-xl '>
        <div className='absolute top-0 left-0 right-0 bottom-0 rounded-xl overflow-hidden'>
          <Image
            alt='Card background'
            className='object-contain '
            src={poemImage}
          />
        </div>
      </CardBody>
    </Card>
  );
}
