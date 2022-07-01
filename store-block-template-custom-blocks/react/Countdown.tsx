import React, { useState } from 'react';
import { useQuery } from 'react-apollo';

import { useCssHandles } from 'vtex.css-handles';
import useProduct from 'vtex.product-context/useProduct';

import { TimeSplit } from './typings/global';
import { tick, getTwoDaysFromNow } from './utils/time';

import productReleaseDate from './graphql/productReleaseDate.graphql';

interface CountdownProps {}

const DEFAULT_TARGET_DATE = getTwoDaysFromNow();

const CSS_HANDLES = ['countdown'];

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({}) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  const handles = useCssHandles(CSS_HANDLES);

  const { product } = useProduct();

  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText
    },
    ssr: false
  });

  if (!product) {
    return (
      <div>
        <span>There is no product context.</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <span>Error!</span>
      </div>
    );
  }

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime);
  
  //console.log({data})

  return (
    <div className={`${handles.countdown} t-heading-2 fw3 w-100 c-muted-1 db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  );
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default Countdown;